import fetch from '../data/fetch'
import { config } from '../config'

export const REQUEST_SIGNUP = "REQUEST_SIGNUP"
export const SUCCEEDED_SIGNUP = "SUCCESS_SIGNUP"
export const FAILED_SIGNUP = "FAILED_SIGNUP"
export const SERVER_DOWN = "SERVER_DOWN"
export const OTHER_ERROR = "OTHER_ERROR"
export const LONG_USERNAME = "LONG_USERNAME"
export const DUPLICATE_EMAIL = "DUPLICATE_EMAIL"
export const SHORT_PASSWORD = "SHORT_PASSWORD"
export const COMMON_PASSWORD = "COMMON_PASSWORD"
export const PAGE_NOT_FOUND = "PAGE_NOT_FOUND"
export const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"

interface signUpAction {
	type: string
	username: string
	token?: string
	error?: any
}

export function requestSignup(user) {
	return {
		type: REQUEST_SIGNUP
	}
}

export function receivedSignup(result) {
	let action: signUpAction = <signUpAction>{};
	if(result.success){
		action.type = SUCCEEDED_SIGNUP
		action.username = result.username
		action.token = result.token
	} else {
		action.type = FAILED_SIGNUP
		action.error = result.error
	}

	return action;
}

export function fetchSignupResult(user) {
	return (dispatch, getState) => {
		dispatch(requestSignup(user))
		return fetch('/create-user', {
			username: "guest",
			method: 'POST',
			args: user,
		})
		.then(response => {
			if (response.status >= 200 && response.status < 300) {
				return Promise.resolve(response.json())
			} else {
				var error = <any> new Error(`${response.status}`)
				error.response = response
				return Promise.reject(error)
			}
		})
		.then(json => {
			dispatch(receivedSignup(json))
		})
		.catch(err => {
			if(err) {
				if(err.code && err.code == "ECONNREFUSED") {
					dispatch(serverDown())
				} else {
					if(err.response.status == 404){
						dispatch(pageNotFound())
					} else if (err.response.status == 500) {
						dispatch(internalServerError(err, getState().username))
					} else {
						dispatch(otherError(err, getState().username))
					}
				}
			} 
		})
	}
}

export function serverDown() {
	return {
		type: SERVER_DOWN
	}
}

export function otherError(err, username) {
	return {
		type: OTHER_ERROR,
		error: err,
		username,
		time: new Date(),
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