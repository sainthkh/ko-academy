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

const postcss = require('gulp-postcss')
const modules = require('postcss-modules')

const rollup = require('rollup').rollup
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const nodeGlobals = require('rollup-plugin-node-globals')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const json = require('rollup-plugin-json')

const bs = require('browser-sync').create()

const _ = require('lodash')

const fs = require('fs-path')
const path = require('path')
const exec = require('child_process').exec;

var opts = {
	compileOnlyChangedTs: true,
	compileOnlyChangedPcss: true,
	dist: 'temp/dist',
	distApp: 'temp/dist/app',
	clientBundle: 'temp/client',
}

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
	return gulp.src('temp/**/*.*', {read: false})
		.pipe(clean())
})

//
// Compilers
//

// Just copy index.js
gulp.task('move-index-js', () => {
	return gulp.src('index.js')
		.pipe(gulp.dest('temp/dist'))
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
		.pipe(gulp.dest(opts.distApp + '/common'))
})

gulp.task('compile-pcss', () => {
	cssTsFiles = []
	return gulp.src('app/**/*.pcss')
		.pipe($if(opts.compileOnlyChangedPcss, changed(opts.distApp)))
		.pipe(gulp.dest(opts.distApp))
		.pipe(postcss([
			modules({
				generateScopedName: '[local]_[hash:base64:5]',
				getJSON: (filePath, obj) => {
					const relativeFilePath = filePath.substr(__dirname.length)
					const tsFilePath = (path.join(__dirname, relativeFilePath) + '.ts').replace("pcss", "css")
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
		.pipe(gulp.dest(opts.clientBundle))
})

gulp.task('create-css-ts', () => {
	cssTsFiles.forEach(file => {
		fs.writeFileSync(file.path, file.content)
		let path = file.path.replace('dist\\app', 'client')
		fs.writeFileSync(path, file.content)
		path = path.replace(".ts", ".js")
		fs.writeFileSync(path, file.content)
	})
	return "Done"
})

gulp.task('compile-css-ts', () => {
	return gulp.src('temp/dist/app/**/*.css.ts')
		.pipe(ts({
			module: "commonjs",
			target: "es5",
		}))
		.pipe(gulp.dest('temp/dist/app'))
})

gulp.task('create-style-css', () => {
	return gulp.src(opts.clientBundle + '/**/*.pcss')
		.pipe(concat('style.css'))
		.pipe(gulp.dest('temp/dist/static'))
})

// Compile TS
gulp.task('compile-ts', () => {
	return gulp.src('app/**/*.{ts,tsx}')
		.pipe($if(opts.compileOnlyChangedTs, changed(opts.distApp)))
		.pipe(gulp.dest(opts.distApp))
		.pipe(ts({
			jsx: "react",
			module: "commonjs",
			target: "es5",
			sourceMap: true
		}))
		.pipe(gulp.dest('temp/dist/app'))
})

gulp.task('compile-changed-ts-to-es6', () => {
	return gulp.src('app/**/*.{ts,tsx}')
		.pipe($if(opts.compileOnlyChangedTs, changed(opts.clientBundle)))
		.pipe(gulp.dest(opts.clientBundle))
		.pipe(ts({
			jsx: "react",
			module: "es6",
			target: "es5",
			moduleResolution: "node",
		}))
		.pipe(gulp.dest(opts.clientBundle))
})

//
// Run Server/Client
//

// Client Js bundle

gulp.task('bundle-client-js', (done) => {
	seq(
		'replace-import',
		'rollup',
		done
	)
})

gulp.task('replace-import', () => {
	let replacements = [
		"CSSModules",
		"isoFetch"
	]
	return gulp.src('temp/client/**/*.js')
		.pipe(replace(new RegExp(`import \\* as (${replacements.join('|')})`, 'g'), "import $1"))
		.pipe(gulp.dest(opts.clientBundle))
})

gulp.task('rollup', () => {
	return rollup({
		entry: 'temp/client/client.js',
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
			dest: 'temp/dist/static/bundle.js'
		});
	})
})

// nodemon server

var server;
var restartTasks = [];

gulp.task('start-test-server', (done) => {
	var started = false
	server = nodemon({
		script: path.join(__dirname, 'temp/dist/index.js'),
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

			restartTasks = []
			if(_.includes(exts, '.pcss')) {
				restartTasks.push('compile-changed-pcss')
			}

			if(_.includes(exts, '.ts') || _.includes(exts, '.tsx')) {
				restartTasks.push('compile-and-bundle-changed-ts')
			}
			restartTasks.push('reload-client')

			return ['run-restart-tasks']
		}
	})
	.on('start', () => {
		if(!started) {
			started = true
			done()
		}
	})
})

gulp.task('run-restart-tasks', done => {
	restartTasks.push(done)
	this.apply(seq, restartTasks)
})

gulp.task('compile-changed-ts', done => {
	opts.compileOnlyChangedTs = true
	seq(
		'compile-ts',
		done
	)
})

gulp.task('compile-and-bundle-changed-ts', done => {
	seq(
		['compile-changed-ts', 'compile-changed-ts-to-es6'],
		'bundle-client-js',
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
		files: "temp/dist/**/*",
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
	var test = require('./test/current.js')
	test = path.join(__dirname, opts.distApp, test)
	console.log(test)
	exec(`node ${test}|.\\node_modules\\.bin\\tap-spec`, (err, stdout, stderr) => {
		console.log(stdout)
		console.log(stderr)
		done()
	})
})