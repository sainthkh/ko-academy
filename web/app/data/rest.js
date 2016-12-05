'use strict'
const restify = require('restify')
import config from '../config'

const client = restify.createJsonClient({ 
	url: config.restServer,
	version: '*'
});

export default client;