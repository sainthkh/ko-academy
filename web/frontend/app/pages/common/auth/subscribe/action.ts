import { 
	fetch, FETCH_SUCCESS
} from '../../data/fetch'

export const REQUEST_SUBSCRIBE = "REQUEST_SUBSCRIBE"
export const SUCCEEDED_SUBSCRIBE = "SUCCESS_SUBSCRIBE"
export const FAILED_SUBSCRIBE = "FAILED_SUBSCRIBE"

export const INVALID_EMAIL = "INVALID_EMAIL"

interface subscribeAction {
	type: string
	error?: any
}

export function requestSubscribe(user) {
	return {
		type: REQUEST_SUBSCRIBE
	}
}

export function receivedSubscribe(result) {
	let action: subscribeAction = <subscribeAction>{};
	if(result.success){
		action.type = SUCCEEDED_SUBSCRIBE
	} else {
		action.type = FAILED_SUBSCRIBE
		action.error = [INVALID_EMAIL]
	}

	return action;
}

export function fetchSubscribeResult(user) {
	return (dispatch, getState) => {
		dispatch(requestSubscribe(user))
		return fetch('/subscribe', "guest", {
			method: 'POST',
			args: user,
		})
		.then(json => {
			dispatch(receivedSubscribe(json))
		})
		.catch(err => {
			dispatch(err)
		})
	}
}