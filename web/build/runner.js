const nodemon = require('nodemon')
const argv = require('yargs').argv
const bs = require('browser-sync').create()

const path = require('path')
const exec = require('child_process').exec

const bundler = require('./bundler')

console.log('Starting nodemon')

nodemon({
	script: path.join(__dirname, '../.debug', 'index.js'),
	ext: false,
	watch: false,
})

bs.init({
	proxy: {
		target: "localhost:3000",
		ws: true,
	},
	files: false, //nodemon watches
	browser: (argv.a || argv.all) ? ["firefox", "chrome", "iexplore", path.join(__dirname, ".bin", "edge.exe")] : ["chrome"], /* edge launcher from https://github.com/MicrosoftEdge/edge-launcher */ 
	port: 5101,
})

nodemon.on('start', () => {
	console.log('nodemon started')
	bs.reload()
})
nodemon.on('restart', files => {
	console.log('nodemon restarts')
})
nodemon.on('quit', () => {
	console.log('done')
})

process.stdin.on('data', chunk => {
	var command = (chunk + '').trim().toLowerCase()
	switch(command) {
		case 'c':
			console.log('compile started')
			exec('gulp compile-changed', (err, stdout, stderr) => {
				console.log(stderr)
				console.log('compile ended')
				bundler(false)
				.then(bundle => {
					nodemon.emit('restart')
				})
			})
			break
	}
})