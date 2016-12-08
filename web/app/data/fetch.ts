'use strict'
import {config} from '../config'
import * as isoFetch from 'isomorphic-fetch'

interface fetchOptions extends RequestInit {
	username: string
	args: any
}

function btoa(str) {
	let buffer = str instanceof Buffer? str: new Buffer(str.toString(), 'binary');
	return buffer.toString('base64')
}

export default function fetch (resource: string, opts:fetchOptions) {
	opts.headers = opts.headers? opts.headers: {}
	opts.headers['Authorization'] = "Basic " + btoa(`${opts.username}:${config.apiKey}`)
	opts.body = JSON.stringify(opts.args)
	return isoFetch(config.restServer + resource, opts)
}