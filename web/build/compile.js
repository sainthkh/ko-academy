const fs = require('fs-extra')
const ts = require('typescript')

const postcss = require('postcss')

const path = require('path')
const exec = require('child_process').exec;

const BASE_DIR = path.join(__dirname, '..')

function compile(files, production) {
	files.forEach(fileName => {
		var ext = path.extname(fileName)
		switch(ext) {
			case '.ts':
			case '.tsx':
				compileTs(fileName, production)
				let relPath = path.relative(BASE_DIR, fileName)
				if(relPath.match(/^(\.\/)?(app|admin).*/)) {
					compileTsToES6(fileName, production)
				}
				break;
			case '.pcss':
				compilePostCSS(fileName, production)
				break;
			default:
				copy(fileName, production)
				break;
		}
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
		inlineSourceMap: true,
	})
	ensureWrite(compileTsDestPath(fileName, production), result.outputText)
}

function compileTsToES6(fileName, production) {
	var result = compileTsFile(fileName, {
		jsx: "react",
		module: "es6",
		target: "es5",
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
		fileName: path.relative(BASE_DIR, fileName),
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
	postcss([
		require('precss'),
		require('postcss-modules')({
			generateScopedName: '[local]_[hash:base64:5]',
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
	.process(code, { from: fileName, to: './temp/a.css'})
	.then(result => {
		ensureWrite(cssFilePath(fileName, production), result.css)
	})
}

function cssjsFilePath(fileName, production, client) {
	return destFilePath((fileName + '.js').replace("pcss", "css"), production, client)
}

function cssFilePath(fileName, production) {
	return destFilePath(fileName.replace("pcss", "css"), production, '.css')
}

//
// Utils
//

function remove(target, production) {
	fs.removeSync(path.join(destDir(production), target))
	console.log('removed ' + target)
}

function copy(target, production) {
	fs.copySync(target, path.join(destDir(production), target))
	console.log('copied ' + target)
}

function destDir(production) {
	return path.join(BASE_DIR, production ? '.production':'.debug')
}

function destFilePath(filePath, production, special) {
	return path.join(destDir(production), special ? special:'', path.relative(BASE_DIR, filePath))
}

function ensureWrite(fileName, data) {
	fs.ensureFileSync(fileName)
	fs.writeFileSync(fileName, data)
}