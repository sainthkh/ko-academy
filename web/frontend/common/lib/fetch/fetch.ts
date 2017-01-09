'use strict'
import * as isoFetch from 'isomorphic-fetch'

export const FETCH_SUCCESS = "FETCH_SUCCESS"
export const SERVER_DOWN = "SERVER_DOWN"
export const PAGE_NOT_FOUND = "PAGE_NOT_FOUND"
export const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
export const OTHER_ERROR = "OTHER_ERROR"

export interface FetchSetting {
	token: string
	method: string
	args: any
	resource: string
	admin: boolean
}

export function fetch(setting:FetchSetting) {
	let { token, method, args, resource, admin } = setting
	let options:RequestInit = {
		headers: {
			'Authorization': `Bearer ${_btoa(token)}`,
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

function _btoa(str) {
	return typeof btoa !== 'undefined'? btoa(str) : ''
}