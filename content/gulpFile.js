const gulp = require('gulp')
const ts = require('gulp-typescript')
const nodemon = require('gulp-nodemon')
const seq = require('run-sequence')
const clean = require('gulp-clean')
const $if = require('gulp-if')
const changed = require('gulp-changed')

const argv = require('yargs').argv

const path = require('path')
const exec = require('child_process').exec;

function options() {
	let o = {}
	o.compileOnlyChangedTs = true
	o.production = argv.p || argv.production 
	o.dest = o.production ? '.production' : '.debug'
	o.path = p => {
		return path.join(__dirname, o.dest, p)
	}
	o.src = o.path('src')
	return o
}

var opts = options()

//
// Basic Commands
//

gulp.task('test', (done) => {
	seq(
		'compile-ts',
		'move-txt',
		'run-unit-test',
		done
	)
})

gulp.task('run', done => {
	seq(
		'compile', 
		'move-txt',
		'move-index-js',
		'start-test-server',
		done
	)
})

gulp.task('compile', (done) => {
	opts.compileOnlyChangedTs = false
	seq(
		'clean',
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

gulp.task('move-txt', () => {
	return gulp.src('src/**/*.txt')
		.pipe(gulp.dest(opts.src))
})

// Compile TS
gulp.task('compile-ts', () => {
	return gulp.src('src/**/*.{ts,tsx}')
		.pipe($if(opts.compileOnlyChangedTs, changed(opts.src)))
		.pipe(gulp.dest(opts.src))
		.pipe(ts({
			jsx: "react",
			module: "commonjs",
			target: "es5",
			sourceMap: true
		}))
		.pipe(gulp.dest(opts.src))
})

//
// Run Server
//


// nodemon server

var server;
var restartTasks = [];

gulp.task('start-test-server', (done) => {
	var started = false
	server = nodemon({
		script: opts.path('index.js'),
		watch: [
			"src"
		],
		ignore: [
			"*test.ts"
		],
		ext: 'ts',
		verbose: true,
		tasks: ['compile-ts']
	})
	.on('start', () => {
		if(!started) {
			started = true
			done()
		}
	})
})

gulp.task('restart-server', done => {
	server.emit('restart')
	done()
})

//
// Unit Tests
//
gulp.task('run-unit-test', (done) => {
	exec(`node ${path.join(opts.src, require('./test/current.js'))}|.\\node_modules\\.bin\\tap-spec`, (err, stdout, stderr) => {
		console.log(stdout)
		console.log(stderr)
		done()
	})
})