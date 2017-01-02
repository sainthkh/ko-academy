'use strict'
import {config} from '../config'
import * as isoFetch from 'isomorphic-fetch'

export const FETCH_SUCCESS = "FETCH_SUCCESS"
export const SERVER_DOWN = "SERVER_DOWN"
export const PAGE_NOT_FOUND = "PAGE_NOT_FOUND"
export const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
export const OTHER_ERROR = "OTHER_ERROR"

interface fetchOptions extends RequestInit {
	args: any
}

interface fetchResult {
	type: string
	data?: any
}

function btoa(str) {
	let buffer = str instanceof Buffer? str: new Buffer(str.toString(), 'binary');
	return buffer.toString('base64')
}

export function fetch (resource: string, username: string, opts:fetchOptions): Promise<any> {
	opts.headers = opts.headers? opts.headers: {}
	opts.headers['Content-Type'] = "application/json"
	opts.body = JSON.stringify(opts.args)
	return isoFetch('/api' + resource, opts)
		.then(response => {
			if (response.status >= 200 && response.status < 300) {
				return Promise.resolve(response.json())
			} else {
				var error = <any> new Error(`${response.status}`)
				error.response = response
				return Promise.reject(error)
			}
		})
		.catch(err => {
			if(err) {
				if(err.code && err.code == "ECONNREFUSED") {
					throw serverDown()
				} else {
					if(err.response.status == 404){
						throw pageNotFound()
					} else if (err.response.status == 500) {
						throw internalServerError(err, username)
					} else {
						throw otherError(err, username)
					}
				}
			} 
		})
}


export function serverDown() {
	return {
		type: SERVER_DOWN
	}
}

export function otherError(err, username) {
	return {
		type: OTHER_ERROR,
		error: {
			obj: err,
			username,
			time: new Date(),
		} 
	}
}

export function pageNotFound() {
	return {
		type: PAGE_NOT_FOUND
	}
}

export function internalServerError(err, username) {
	return {
		type: INTERNAL_SERVER_ERROR,
		error: {
			obj: err,
			username: username,
			time: new Date(),
		},
	}
}