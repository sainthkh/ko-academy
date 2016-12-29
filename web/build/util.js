const fs = require('fs-extra')
const path = require('path')

const BASE_DIR = path.join(__dirname, '..')

function remove(target, production) {
	fs.removeSync(path.join(destDir(production), target))
	console.log('removed ' + target)
}

function copy(target, production) {
	fs.copySync(target, path.join(destDir(production), target))
	console.log('copied ' + target)
}

function destDir(production, special) {
	return path.join(BASE_DIR, production ? '.production':'.debug', special ? special:'')
}

function destFilePath(filePath, production, special) {
	return path.join(destDir(production, special), path.relative(BASE_DIR, filePath))
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
	BASE_DIR,
	remove,
	copy,
	destDir,
	destFilePath,
	ensureWrite,
	files,
	getDirType
}