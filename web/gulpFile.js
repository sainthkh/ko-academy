const gulp = require('gulp')
const concat = require('gulp-concat')
const ts = require('gulp-typescript')
const nodemon = require('gulp-nodemon')
const seq = require('run-sequence')
const clean = require('gulp-clean')
const replace = require('gulp-replace')
const $if = require('gulp-if')
const changed = require('gulp-changed')
const rename = require('gulp-rename')

const postcss = require('gulp-postcss')
const modules = require('postcss-modules')

const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')

const _ = require('lodash')
const argv = require('yargs').argv

const fs = require('fs-path')
const path = require('path')
const exec = require('child_process').exec;

function options() {
	let o = {}
	o.compileOnlyChangedTs = true
	o.compileOnlyChangedPcss = true
	o.production = argv.p || argv.production 
	o.dest = o.production ? '.production' : '.debug'
	o.path = p => {
		return path.join(__dirname, o.dest, p)
	}
	o.app = o.path('app')
	o.server = o.path('server')
	o.client = o.path('.client')
	o.static = o.path('static')

	return o
}

var opts = options()

//
// Basic Commands
//

gulp.task('test', (done) => {
	seq(
		'compile-changed-pcss',
		'app-compile-ts',
		'run-unit-test',
		done
	)
})

gulp.task('release', done => {
	seq(
		'compile',
		'move-index-js',
		'clean-ts',
		done
	)
})

gulp.task('compile', done => {
	seq(
		['app-compile', 'server-compile'],
		done
	)
})

gulp.task('app-compile', (done) => {
	opts.compileOnlyChangedTs = false
	opts.compileOnlyChangedPcss = false
	seq(
		'app-clean',
		'compile-postcss',
		['app-compile-ts', 'compile-changed-ts-to-es6'],
		done
	)
})

gulp.task('server-compile', done => {
	opts.compileOnlyChangedTs = false
	opts.compileOnlyChangedPcss = false
	seq(
		'server-clean',
		'server-compile-ts',
		done
	)
})

function taskClean(path) {
	gulp.task(`${path}-clean`, () => {
		return gulp.src(opts.path(`/${path}/**/*.*`), {read: false})
			.pipe(clean())
	})	
}
taskClean('app')
taskClean('server')

gulp.task('clean-ts', () => {
	if(!opts.production) return "done"
	return gulp.src(opts.path('/**/*.{ts,tsx}'), {read: false})
		.pipe(clean())
})

//
// Compilers
//

// Just copy index.js
gulp.task('move-index-js', () => {
	return gulp.src('index.js')
		.pipe(gulp.dest(opts.dest))
})


// Compile PostCSS
var cssTsFiles = []

gulp.task('compile-postcss', (done) => {
	seq(
		'pcss-dependency',
		'compile-pcss',
		['create-css-ts', 'create-style-css'],
		'compile-css-ts',
		done
	)
})

gulp.task('pcss-dependency', () => {
	return gulp.src('app/common/{global,base}.pcss')
		.pipe(gulp.dest(opts.path('app/common')))
})

gulp.task('compile-pcss', () => {
	cssTsFiles = []
	return gulp.src('app/**/*.pcss')
		.pipe($if(opts.compileOnlyChangedPcss, changed(opts.app)))
		.pipe(gulp.dest(opts.app))
		.pipe(postcss([
			require('precss'),
			modules({
				generateScopedName: '[local]_[hash:base64:5]',
				getJSON: (filePath, obj) => {
					const tsFilePath = (filePath + '.ts').replace("pcss", "css")
					let file = {}
					file.path = tsFilePath
					file.content =  
						"const styles = " + JSON.stringify(obj) + "\n" +
						"export default styles"
					cssTsFiles.push(file)
				}
			}),
			require('postcss-utilities'),
			require('postcss-short'),
			require('postcss-cssnext'),
		]))
		.pipe(gulp.dest(opts.client))
})

gulp.task('create-css-ts', () => {
	cssTsFiles.forEach(file => {
		fs.writeFileSync(file.path, file.content)

		// write files for bundle
		let path = file.path.replace(opts.app, opts.client)
		fs.writeFileSync(path, file.content)
		path = path.replace(".ts", ".js")
		fs.writeFileSync(path, file.content)
	})
	return "Done"
})

gulp.task('compile-css-ts', () => {
	return gulp.src(opts.path('app/**/*.css.ts'))
		.pipe(ts({
			module: "commonjs",
			target: "es5",
		}))
		.pipe(gulp.dest(opts.app))
})

gulp.task('create-style-css', () => {
	return gulp.src(opts.path('.client/**/*.pcss'))
		.pipe(concat(opts.production ? 'style.min.css' : 'style.css'))
		.pipe($if(opts.production, cleanCSS()))
		.pipe(gulp.dest(opts.static))
})

// Compile TS
function taskCompileTs(path) {
	gulp.task(`${path}-compile-ts`, () => {
		return gulp.src(`${path}/**/*.{ts,tsx}`)
			.pipe($if(opts.compileOnlyChangedTs, changed(opts[path])))
			.pipe(gulp.dest(opts[path]))
			.pipe(ts({
				jsx: "react",
				module: "commonjs",
				target: "es5",
				sourceMap: true
			}))
			.pipe(gulp.dest(opts[path]))
	})	
}

taskCompileTs('app')
taskCompileTs('server')

gulp.task('compile-changed-ts-to-es6', () => {
	let replacements = [
		"CSSModules",
		"isoFetch", 
		"React",
		"ReactDom",
		"Immutable",
		"Measure",
	]
	return gulp.src('app/**/*.{ts,tsx}')
		.pipe($if(opts.compileOnlyChangedTs, changed(opts.client)))
		.pipe(gulp.dest(opts.client))
		.pipe(ts({
			jsx: "react",
			module: "es6",
			target: "es5",
			moduleResolution: "node",
		}))
		.pipe(replace(new RegExp(`import \\* as (${replacements.join('|')})`, 'g'), "import $1"))
		.pipe(gulp.dest(opts.client))
})

//
// compile-changed
//

gulp.task('compile-changed', done => {
	opts.compileOnlyChangedTs = true
	seq(
		'compile-changed-pcss',
		['app-compile-ts', 'server-compile-ts', 'compile-changed-ts-to-es6'],
		done
	)
})

gulp.task('compile-changed-pcss', done => {
	opts.compileOnlyChangedPcss = true
	seq(
		'compile-postcss',
		done
	)
})

//
// Unit Tests
//
gulp.task('run-unit-test', (done) => {
	var testPaths = require('./test/current.js')
	if (!Array.isArray(testPaths)) {
		testPaths = [testPaths]
	}
	testPaths.forEach(p => {
		exec(`node ${path.join(opts.app, p)}|.\\node_modules\\.bin\\tap-spec`, (err, stdout, stderr) => {
			console.log(stdout)
			console.log(stderr)
		})
	})
	done()
})