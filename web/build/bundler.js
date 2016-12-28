const rollup = require('rollup').rollup
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const nodeGlobals = require('rollup-plugin-node-globals')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const json = require('rollup-plugin-json')
const rollupReplace = require('rollup-plugin-replace')

const uglify = require('uglify-js')

const fs = require('fs')
const path = require('path')

var cache;

module.exports = (production) => {
	console.log('bundling started')
	var dest = production ? '.production': '.debug'
	var entryPath = path.join(__dirname, '..', dest, '.client/client.js')
	var destFilePath = path.join(__dirname, '..', dest, 'static/bundle.js')
	return rollup({
		entry: entryPath,
		context: 'window',
		plugins: [
			rollupReplace({
				'process.env.NODE_ENV': JSON.stringify( 'production' ),
			}),
			nodeResolve({ 
				browser: true, 
				preferBuiltins: true,
			}),
			json(),
			commonjs({
				namedExports: {
					'node_modules/immutable/dist/immutable.js': [ 'Map', 'List'],
				}
			}),
			nodeGlobals(),
			nodeBuiltins(),
		],
		cache: cache
	})
	.then(bundle => {
		var result = bundle.generate({
			format: 'iife'
		});

		// Cache our bundle for later use (optional)
		cache = bundle;

		fs.writeFileSync(destFilePath, result.code );
		return bundle;
	})
	.then(bundle => {
		if(production) {
			console.log('Javascript minify started')
			let result = uglify.minify(destFilePath)
			fs.writeFileSync(destFilePath, result.code)
			console.log('Javascript minify ended')
		}
		console.log('bundling finished')
		return bundle
	})
}