const client = require('../data/rest')
const config = require('../config')

export const REQUEST_SIGNUP = "REQUEST_SIGNUP"
export const SUCCEEDED_SIGNUP = "SUCCESS_SIGNUP"
export const FAILED_SIGNUP = "FAILED_SIGNUP"
export const SERVER_DOWN = "SERVER_DOWN"
export const OTHER_ERROR = "OTHER_ERROR"

export function receivedSignup(result) {
	var action = {}
	if(result.success){
		action.type = SUCCEEDED_SIGNUP
		action.username = result.username
		action.token = result.token
	} else {
		action.type = FAILED_SIGNUP
		action.msg = result.msg
	}

	return action;
}

export function requestSignup(user) {
	return {
		type: REQUEST_SIGNUP
	}
}

export function serverDown() {
	return {
		type: SERVER_DOWN
	}
}

export function otherError(err, username, time) {
	return {
		type: OTHER_ERROR,
		error: err,
		username,
		time,
	}
}

export function fetchSignupResult(user) {
	return (dispatch, getState) => {
		dispatch(requestSignup(user))
		client.basicAuth("guest", config.apiKey)
		
		client.post('/create-user', user, (err, req, res, obj) => { 
			if(err) {
				if(err.code && err.code == "ECONNREFUSED") {
					dispatch(serverDown())
				} else {
					dispatch(otherError(err, getState().username, new Date()))
				}
			} else {
				dispatch(receivedSignup(obj))
			}
		})
	}
}