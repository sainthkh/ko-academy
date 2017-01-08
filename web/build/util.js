const fs = require('fs-extra')
const path = require('path')

const PROJECT_ROOT = path.join(__dirname, '..')

function remove(target, production) {
	fs.removeSync(path.join(destDir(production), target))
	console.log('removed ' + target)
}

function copy(target, production, showMessage) {
	fs.copySync(target, path.join(destDir(production), target))
	if (showMessage) {
		console.log('copied ' + target)
	}
}

function destDir(production, special) {
	return path.join(PROJECT_ROOT, production ? '.production':'.debug', special ? special:'')
}

function destFilePath(filePath, production, special) {
	return path.join(destDir(production, special), path.relative(PROJECT_ROOT, filePath))
}

function removeFrontend(filePath) {
	return filePath.replace(/frontend(\/|\\)/, '')
}

function ensureWrite(fileName, data) {
	fs.ensureFileSync(fileName)
	fs.writeFileSync(fileName, data)
}

var walk = function(dir, done) {
	var results = [];
	fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		var pending = list.length;
		if (!pending) return done(null, results);
		list.forEach(function(file) {
			file = path.resolve(dir, file);
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function(err, res) {
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
				} else {
					results.push(file);
					if (!--pending) done(null, results);
				}
			});
		});
	});
};

function getDirType(fileName) {
	return fileName.substring(0, fileName.indexOf(path.sep))
}

function files(dir) {
	return new Promise(function(resolve, reject) {
		walk(dir, (err, results) => {
			if(err) {
				reject(err)
			} else {
				resolve(results)
			}
		})
	})
}

module.exports = {
	PROJECT_ROOT,
	remove,
	copy,
	destDir,
	destFilePath,
	ensureWrite,
	files,
	removeFrontend,
	getDirType
}