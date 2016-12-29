const production = require('yargs').argv.p
const release = require('./release')

release(production)