const client = require('../data/rest')
const config = require('../config')

export const REQUEST_SIGNUP = "REQUEST_SIGNUP"
export const SUCCEEDED_SIGNUP = "SUCCESS_SIGNUP"
export const FAILED_SIGNUP = "FAILED_SIGNUP"

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

export function fetchSignupResult(user) {
	return dispatch => {
		dispatch(requestSignup(user))
		client.basicAuth("guest", config.apiKey)
		
		client.post('/create-user', user, (err, req, res, obj) => { 
			dispatch(receivedSignup(obj))
		})
	}
}