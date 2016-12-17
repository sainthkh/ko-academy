import {
	fetch 
} from '../../data/fetch'

export const REQUEST_LOGIN = "REQUEST_LOGIN"
export const SUCCEEDED_LOGIN = "SUCCEEDED_LOGIN"
export const FAILED_LOGIN = "FAILED_LOGIN"

export function requestLogin(user) {
	return {
		type: REQUEST_LOGIN
	}
}

export function receivedLogin(res): any {
	if(res.success) {
		return {
			type: SUCCEEDED_LOGIN,
			username: res.username,
			token: res.token,
		}
	} else {
		return {
			type: FAILED_LOGIN,
		}
	}
}

export function fetchLogin(user) {
	return (dispatch, getState) => {
		dispatch(requestLogin(user))

		return fetch('/login', "guest", {
			args: user
		})
		.then(json => {
			dispatch(receivedLogin(json))
		})
		.catch(err => {
			dispatch(err)
		}) 
	}
}