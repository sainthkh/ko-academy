import * as _ from 'lodash'
const fs = require('fs')
const path = require('path')

var data;
function commonPasswords() {
	if(!data) {
		data = fs.readFileSync(path.join(__dirname, '10k_most_common_8char.txt'))
		data = data.toString().split('\n')
	}
	return data
}

export function isCommonPassword(password) {
	return _.includes(commonPasswords(), password)
}