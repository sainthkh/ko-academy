'use strict'
import * as isoFetch from 'isomorphic-fetch'

export const FETCH_SUCCESS = "FETCH_SUCCESS"
export const SERVER_DOWN = "SERVER_DOWN"
export const PAGE_NOT_FOUND = "PAGE_NOT_FOUND"
export const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
export const OTHER_ERROR = "OTHER_ERROR"

export interface fetchOptions extends RequestInit {
	args: any
}

function btoa(str) {
	let buffer = str instanceof Buffer? str: new Buffer(str.toString(), 'binary');
	return buffer.toString('base64')
}

export function fetch (resourceRoot: string, resource: string, username: string, opts:fetchOptions): Promise<any> {
	opts.headers = opts.headers? opts.headers: {}
	opts.headers['Content-Type'] = "application/json"
	opts.body = JSON.stringify(opts.args)
	return isoFetch(resourceRoot + resource, opts)
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
						throw internalServerError(err)
					} else {
						throw otherError(err)
					}
				}
			} 
		})
}

export function fetch2 (resourceRoot: string, resource: string, opts:fetchOptions): Promise<any> {
	return fetch(resourceRoot, resource, "guest", opts)
}

export interface FetchSetting {
	token: string
	method: string
	args: any
	resource: string
	admin: boolean
}

export function fetch3(setting:FetchSetting) {
	let { token, method, args, resource, admin } = setting
	let options:RequestInit = {
		headers: {
			'Authorization': `Bearer ${btoa(token)}`,
			'Content-Type': 'application/json',
		}, 
		method,
	}
	if (method == "POST") {
		options.body = JSON.stringify(args)
	} else {
		let query = Object.keys(args).map((k) => 
			`${encodeURIComponent(k)}=${encodeURIComponent(args[k])}`).join('&')
		resource = `${resource}?${query}`
	}
	return isoFetch(`${admin ? "/admin":""}/api${resource}`, options)
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
						throw internalServerError(err)
					} else {
						throw otherError(err)
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

export function otherError(err) {
	return {
		type: OTHER_ERROR,
		error: {
			obj: err,
			time: new Date(),
		} 
	}
}

export function pageNotFound() {
	return {
		type: PAGE_NOT_FOUND
	}
}

export function internalServerError(err) {
	return {
		type: INTERNAL_SERVER_ERROR,
		error: {
			obj: err,
			time: new Date(),
		},
	}
}