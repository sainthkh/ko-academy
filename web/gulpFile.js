const gulp = require('gulp')
const concat = require('gulp-concat')
const ts = require('gulp-typescript')
const nodemon = require('gulp-nodemon')
const seq = require('run-sequence')
const clean = require('gulp-clean')
const replace = require('gulp-replace')

const postcss = require('gulp-postcss')
const modules = require('postcss-modules')

const rollup = require('rollup').rollup
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const nodeGlobals = require('rollup-plugin-node-globals')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const json = require('rollup-plugin-json')

const fs = require('fs-path')
const path = require('path')

gulp.task('test-design', (done) => {
	seq(
		['test-move-index-js', 'clean-temp-dist-app',],
		'test-move-app-folder',
		'test-compile-postcss',
		['create-css-ts', 'create-style-css'],
		['test-compile-ts', 'test-compile-client-js'],
		'test-rollup',
		'run-test-server',
		done
	)
})

gulp.task('test-move-index-js', () => {
	return gulp.src('index.js')
		.pipe(gulp.dest('temp/dist'))
})

gulp.task('clean-temp-dist-app', () => {
	return gulp.src('temp/dist/app/**/*.*', {read: false})
		.pipe(clean())
})

gulp.task('test-move-app-folder', () => {
	return gulp.src('app/**/*.*')
		.pipe(gulp.dest('temp/dist/app'))
})

var cssTsFiles = []

gulp.task('test-compile-postcss', () => {
	return gulp.src('app/**/*.pcss')
		.pipe(postcss([
			modules({
				generateScopedName: '[local]_[hash:base64:5]',
				getJSON: (filePath, obj) => {
					const relativeFilePath = filePath.substr(__dirname.length)
					const tsFilePath = (path.join(__dirname, '/temp/dist', relativeFilePath) + '.ts').replace("pcss", "css")
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
		.pipe(gulp.dest('temp/pcss'))
})

gulp.task('create-css-ts', () => {
	cssTsFiles.forEach(file => {
		fs.writeFileSync(file.path, file.content)
	})
	return "Done"
})

gulp.task('create-style-css', () => {
	return gulp.src('temp/pcss')
		.pipe(concat('style.css'))
		.pipe(gulp.dest('temp/dist/static'))
})


gulp.task('test-compile-ts', () => {
	return gulp.src('temp/dist/app/**/*.{ts,tsx}')
		.pipe(ts({
			jsx: "react",
			module: "commonjs",
			target: "es5",
			sourceMap: true
		}))
		.pipe(gulp.dest('temp/dist/app'))
})

gulp.task('test-compile-client-js', () => {
	return gulp.src('temp/dist/app/**/*.{ts,tsx}')
		.pipe(ts({
			jsx: "react",
			module: "es6",
			target: "es5",
			moduleResolution: "node",
			allowSyntheticDefaultImports: true,
		}))
		.pipe(gulp.dest('temp/client-js'))
})

gulp.task('replace-css-modules', () => {
	return gulp.src('temp/client-js/**/*.js')
		.pipe(replace("import * as CSSModules", "import CSSModules"))
		.pipe(gulp.dest('temp/client-js'))
})

gulp.task('test-rollup', ['replace-css-modules'], () => {
	return rollup({
		entry: 'temp/client-js/client.js',
		context: 'window',
		external: ['fs', 'tls', 'net'],
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

gulp.task('test-compile-all', (done) => {
	seq(
		'clean-temp-dist-app',
		'test-move-app-folder',
		'test-compile-postcss',
		['create-css-ts', 'create-style-css'],
		'test-compile-ts',
		done
	)
})

gulp.task('run-test-server', () => {
	nodemon({
		script: path.join(__dirname, 'temp/dist/index.js'),
		watch: [
			"app/**/*.{ts,tsx,css}"
		],
		ignore: [
			"app/**/*test.ts"
		],
		tasks: ['test-compile-all']
	})
})