import { fetch as serverFetch } from './fetch'

export const REQUEST_FETCH = "REQUEST_FETCH"
export const SUCCEEDED_FETCH = "SUCCEEDED_FETCH"
export const FAILED_FETCH = "FAILED_FETCH"
export const ERRORED_FETCH = "ERRORED_FETCH"

interface fetchActionArgs {
	name: string
	processResult: (any) => any
	resource: string
	admin?: boolean
}

export function fetchAction(options:fetchActionArgs) {
	let request = () => ({
		type: {
			name: options.name,
			stage: REQUEST_FETCH
		}
	})

	let received = result => {
		let action = options.processResult(result)
		action.type = {
			name: options.name,
			stage: result.success ? SUCCEEDED_FETCH : FAILED_FETCH,
		}
		return action
	}

	let _fetch = (resource, username, args) => {
		return serverFetch(options.admin? '/admin/api': '/api', resource, username, args)
	}
	return (args, username="guest") => {
		return dispatch => {
			dispatch(request())
			return _fetch(options.resource, username, {
				method: 'POST',
				args: args,
			})
			.then(json => {
				dispatch(received(json))
			})
			.catch(err => {
				dispatch({
					type: ERRORED_FETCH,
					error: err
				})
			})
		}
	}
}