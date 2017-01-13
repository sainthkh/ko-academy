const production = require('yargs').argv.p
const async = require('async')

const compile = require('./compile')
const bundler = require('./bundler')
const { copy, remove, files } = require('./util')

function release(produnction) {
	async.series([
		done => {
			console.log('> Compile Started')

			const compileDirs = ['frontend', 'server']
			async.each(compileDirs, (dir, done2) => {
				remove(dir, production)
				console.log(`compiling ${dir}...`)
				files(dir)
				.then(files => {
					compile(files, production)
					.then(() => {
						done2()
					})
				})
			}, 
			err => {
				if (err) {
					console.log(err)
				} else {
					console.log('< Compile Finished')
					done()
				}
			})
		},
		done => {
			console.log('> Bundling Started')

			const bundleDirs = ['frontend/app', 'frontend/admin']
			async.each(bundleDirs, (dir, done2) => {
				bundler.css(dir, production)
				bundler.js(dir, production)
				.then(() => {
					done2()
				})
			},
			err => {
				if (err) {
					console.log(err)
				} else {
					console.log('< Bundling Finished')
					done()
				}
			})
		}, 
		done => {
			console.log('Copied index.js')
			copy('./index.js', production)
			done()
		},
		done => {
			console.log('Copied static')
			copy('./static', production)
			done()
		},
		done => {
			if(production) {
				console.log('> Finishing production release')
				remove('.css', production)
				remove('.client', production)
				copy('./package.json', production)
				console.log('< Finished production release')
			}
			done()
		}
	])
}

module.exports = release