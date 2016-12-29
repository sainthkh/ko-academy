const nodemon = require('nodemon')
const chokidar = require('chokidar')
const async = require('async')

const fs = require('fs-extra')
const path = require('path')
const exec = require('child_process').exec

const bundler = require('./bundler')
const compile = require('./compile')
const { getDirType, destFilePath } = require('./util')

console.log('Starting test automation server')

nodemon({
	script: "./test/dummy.js",
	ext: false,
	watch: false,
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
			console.log('compile ended')
			var testPaths = JSON.parse(fs.readFileSync('./test/current.json')).target
			testPaths.forEach(p => {
				exec(`node ${destFilePath(p)}|.\\node_modules\\.bin\\tap-spec`, (err, stdout, stderr) => {
					console.log(stdout)
					console.log(stderr)
				})
			})
			initFileList()
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