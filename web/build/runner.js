const nodemon = require('nodemon')
const argv = require('yargs').argv
const bs = require('browser-sync').create()
const chokidar = require('chokidar')
const async = require('async')

const path = require('path')
const exec = require('child_process').exec

const bundler = require('./bundler')
const compile = require('./compile')
const { getDirType } = require('./util')

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
			compile(toBeCompiled)
			async.each(toBeBundled, (dir, done) => {
				Promise.all([bundler.js(dir), bundler.css(dir)])
				.then(() => {
					done()
				})
			}, 
			err => {
				if (err) {
					console.log(err)
				} else {
					nodemon.emit('restart')
				}
				initFileList()
				console.log('compile ended')
			})
			break
	}
})

initFileList()
chokidar.watch(['./admin', './app', './server'], {
	ignoreInitial: true
})
.on('add', path => {
	console.log(`${path} is added`)
	addFile(path)
})
.on('change', path => {
	console.log(`${path} is changed`)
	addFile(path)
})

var toBeCompiled;
var toBeBundled;
function addFile(path) {
	var type = getDirType(path)
	if (type != 'server') {
		toBeBundled.add(type)
	}
}

function initFileList() {
	toBeCompiled = new Set()
	toBeBundled = new Set()
}