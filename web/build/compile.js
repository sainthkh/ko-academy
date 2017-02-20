const fs = require('fs-extra')
const ts = require('typescript')
const async = require('async')

const postcss = require('postcss')

const path = require('path')
const exec = require('child_process').exec;

const { PROJECT_ROOT, destFilePath, ensureWrite, copy } = require('./util')

function compile(files, production) {
	return new Promise(function(resolve, reject) {
		async.each(files, (fileName, done) => {
			// ignore tests in production
			if(production) {
				if (
					fileName.match(/.*(\/|\\)test(\/|\\).*/) || 
					fileName.match(/config\..*/)
				) {
					done()
					return
				} 
			}
				
			var ext = path.extname(fileName)
			let relPath = path.relative(PROJECT_ROOT, fileName)
			switch(ext) {
				case '.ts':
				case '.tsx':
					compileTs(fileName, production)
					if(relPath.match(/^(\.(\/|\\))?frontend(\/|\\).*/)) {
						compileTsToES6(fileName, production)
					}
					done()
					break;
				case '.pcss':
					compilePostCSS(fileName, production)
					.then(() => {
						done()
					})
					break;
				default:
					copy(relPath, production)
					done()
					break;
			}
		},
		err => {
			if(err) {
				console.log(err)
				reject(err)
			} else {
				resolve()
			}
		})	
	})
}

module.exports = compile

//
// Typescript Compiler
//

function compileTs(fileName, production) {
	var result = compileTsFile(fileName, {
		jsx: "react",
		module: "commonjs",
		target: "es5",
		inlineSourceMap: !production,
	})
	ensureWrite(compileTsDestPath(fileName, production), result.outputText)
}

function compileTsToES6(fileName, production) {
	var result = compileTsFile(fileName, {
		jsx: "react",
		module: "es6",
		target: "es3",
		moduleResolution: "node",
	})
	let replacements = [
		"CSSModules",
		"isoFetch", 
		"React",
		"ReactDom",
		"Immutable",
		"Measure",
	]
	var code = result.outputText.replace(new RegExp(`import \\* as (${replacements.join('|')})`, 'g'), "import $1")

	ensureWrite(compileTsDestPath(fileName, production, '.client'), code)
}

function compileTsFile(fileName, options) {
	var code = fs.readFileSync(fileName).toString()
	var result = ts.transpileModule(code, {
		compilerOptions: ts.convertCompilerOptionsFromJson(options).options,
		fileName: path.relative(PROJECT_ROOT, fileName),
		reportDiagnostics: true
	})

	if(result.diagnostics.length > 0) {
		console.log('Error in :' + fileName)
		console.log(result.diagnostics)	
	}

	return result
}

function compileTsDestPath(filePath, production, client) {
	return destFilePath(filePath.replace(/\.tsx?/g, '.js'), production, client)
}

//
// PostCSS Compiler
//

function compilePostCSS(fileName, production) {
	var code = fs.readFileSync(fileName).toString()
	var dest = cssFilePath(fileName, production)
	return postcss([
		require('precss'),
		require('postcss-modules')({
			generateScopedName: production ? '[hash:base64:5]': '[local]_[hash:base64:5]',
			getJSON: (fileName, obj) => {
				let es5 = `var styles = ${JSON.stringify(obj)};\nexports.default=styles`
				ensureWrite(cssjsFilePath(fileName, production), es5)
				let es6 = `const styles = ${JSON.stringify(obj)};\nexport default styles`
				ensureWrite(cssjsFilePath(fileName, production, '.client'), es6)
			}
		}),
		require('postcss-utilities'),
		require('postcss-short'),
		require('postcss-cssnext'),
	])
	.process(code, { from: fileName, to: dest})
	.then(result => {
		ensureWrite(dest, result.css)
	})
}

function cssjsFilePath(fileName, production, client) {
	return destFilePath((fileName + '.js').replace("pcss", "css"), production, client)
}

function cssFilePath(fileName, production) {
	return destFilePath(fileName.replace("pcss", "css"), production, '.css')
}