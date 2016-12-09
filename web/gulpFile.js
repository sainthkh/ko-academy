const gulp = require('gulp')
const concat = require('gulp-concat')
const ts = require('gulp-typescript')
const nodemon = require('gulp-nodemon')
const seq = require('run-sequence')
const clean = require('gulp-clean')
const replace = require('gulp-replace')
const $if = require('gulp-if')
const changed = require('gulp-changed')
const watch = require('gulp-watch')
const rename = require('gulp-rename')

const postcss = require('gulp-postcss')
const modules = require('postcss-modules')

const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')

const rollup = require('rollup').rollup
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const nodeGlobals = require('rollup-plugin-node-globals')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const json = require('rollup-plugin-json')

const bs = require('browser-sync').create()

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
		'compile-ts',
		'run-unit-test',
		done
	)
})

gulp.task('run', done => {
	seq(
		'compile', 
		'move-index-js',
		'start-test-server',
		'init-browser-sync',
		done
	)
})

gulp.task('compile', (done) => {
	opts.compileOnlyChangedTs = false
	opts.compileOnlyChangedPcss = false
	seq(
		'clean',
		'compile-postcss',
		'compile-ts',
		done
	)
})

gulp.task('clean', () => {
	return gulp.src(opts.path('/**/*.*'), {read: false})
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
			require('precss'),
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
gulp.task('compile-ts', () => {
	return gulp.src('app/**/*.{ts,tsx}')
		.pipe($if(opts.compileOnlyChangedTs, changed(opts.app)))
		.pipe(gulp.dest(opts.app))
		.pipe(ts({
			jsx: "react",
			module: "commonjs",
			target: "es5",
			sourceMap: true
		}))
		.pipe(gulp.dest(opts.app))
})

gulp.task('compile-changed-ts-to-es6', () => {
	return gulp.src('app/**/*.{ts,tsx}')
		.pipe($if(opts.compileOnlyChangedTs, changed(opts.client)))
		.pipe(gulp.dest(opts.client))
		.pipe(ts({
			jsx: "react",
			module: "es6",
			target: "es5",
			moduleResolution: "node",
		}))
		.pipe(gulp.dest(opts.client))
})

//
// Run Server/Client
//

// Client Js bundle

gulp.task('bundle-client-js', (done) => {
	let tasks = [
		'replace-import',
		'rollup',
	]
	if(opts.production) {
		tasks.push('minify-js')
	}
	tasks.push(done)
	seq.apply(this, tasks)
})

gulp.task('replace-import', () => {
	let replacements = [
		"CSSModules",
		"isoFetch"
	]
	return gulp.src(opts.path('.client/**/*.js'))
		.pipe(replace(new RegExp(`import \\* as (${replacements.join('|')})`, 'g'), "import $1"))
		.pipe(gulp.dest(opts.client))
})

gulp.task('rollup', done => {
	return rollup({
		entry: opts.path('.client/client.js'),
		context: 'window',
		plugins: [
			nodeResolve({ 
				browser: true, 
				preferBuiltins: true,
			}),
			json(),
			commonjs({
				namedExports: {
					'node_modules/react/react.js' : ['Component', 'Children', 'createElement', 'PropTypes'],
					'node_modules/react-dom/index.js' : ['render']
				}
			}),
			nodeGlobals(),
			nodeBuiltins(),
		]
	}).then(bundle => {
		return bundle.write({
			format: 'iife',
			dest: opts.path('static/bundle.js')
		});
	}).then(bundle => {
		done()
	})
})

gulp.task('minify-js', () => {
	return gulp.src(opts.path('static/bundle.js'))
		.pipe(rename('bundle.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(opts.static))
})

// nodemon server

var server;
var restartTasks = [];

gulp.task('start-test-server', (done) => {
	var started = false
	server = nodemon({
		script: opts.path('index.js'),
		watch: [
			"app"
		],
		ignore: [
			"*test.ts"
		],
		ext: 'ts tsx pcss',
		verbose: true,
		tasks: changedFiles => {
			let exts = _.map(changedFiles, (p) => {
				return path.extname(p)
			})
			exts = _.uniq(exts)

			var tasks = []
			if(_.includes(exts, '.pcss')) {
				tasks.push('pcss-changed')
			} else if(_.includes(exts, '.ts') || _.includes(exts, '.tsx')) {
				tasks.push('ts-changed')
			}

			return tasks
		}
	})
	.on('start', () => {
		if(!started) {
			started = true
			done()
		}
	})
})

gulp.task('pcss-changed', done => {
	seq(
		'compile-changed-pcss',
		'reload-client',
		done
	)
})

gulp.task('compile-changed-ts', done => {
	opts.compileOnlyChangedTs = true
	seq(
		'compile-ts',
		done
	)
})

gulp.task('ts-changed', done => {
	seq(
		['compile-changed-ts', 'compile-changed-ts-to-es6'],
		'bundle-client-js',
		'reload-client',
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

gulp.task('restart-server', done => {
	server.emit('restart')
	done()
})

// Browser Sync

gulp.task('init-browser-sync', done => {
	bs.init({
		proxy: {
			target: "localhost:3000",
			ws: true,
		},
		files: opts.path("/**/*"),
		browser: ["firefox", "chrome", "iexplore", path.join(__dirname, ".bin", "edge.exe")], /* edge launcher from https://github.com/MicrosoftEdge/edge-launcher */
		port: 5101,
	})
	done()
})

gulp.task('reload-client', () => {
	return bs.reload({stream: true})
})

//
// Unit Tests
//
gulp.task('run-unit-test', (done) => {
	exec(`node ${opts.app + require('./test/current.js')}|.\\node_modules\\.bin\\tap-spec`, (err, stdout, stderr) => {
		console.log(stdout)
		console.log(stderr)
		done()
	})
})