import { 
	fetch, 
} from '../../data/fetch'
import { config } from '../../config'

export const REQUEST_SIGNUP = "REQUEST_SIGNUP"
export const SUCCEEDED_SIGNUP = "SUCCESS_SIGNUP"
export const FAILED_SIGNUP = "FAILED_SIGNUP"
export const LONG_USERNAME = "LONG_USERNAME"
export const DUPLICATE_EMAIL = "DUPLICATE_EMAIL"
export const SHORT_PASSWORD = "SHORT_PASSWORD"
export const COMMON_PASSWORD = "COMMON_PASSWORD"

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
		return fetch('/create-user', "guest", {
			method: 'POST',
			args: user,
		})
		.then(json => {
			dispatch(receivedSignup(json))
		})
		.catch(err => {
			if(err) {
				dispatch(err)
			} 
		})
	}
}