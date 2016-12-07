'use strict'
import * as restify from 'restify-clients'
import {config} from '../config'

export const client = restify.createJsonClient({ 
	url: config.restServer,
	version: '*'
});