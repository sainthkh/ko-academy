import { fetch as serverFetch } from './fetch'

export const REQUEST_FETCH = "REQUEST_FETCH"
export const SUCCEEDED_FETCH = "SUCCESS_FETCH"
export const FAILED_FETCH = "FAILED_FETCH"

interface fetchActionArgs {
	name: string
	processResult: (any) => any
	resource: string
	admin?: boolean
}

export function fetchAction(options:fetchActionArgs) {
	return {
		REQUEST_FETCH,
		SUCCEEDED_FETCH,
		FAILED_FETCH,
		request: () => ({
			type: {
				name: options.name,
				stage: REQUEST_FETCH
			}
		}),
		received: result => {
			let action = options.processResult(result)
			action.type.name = options.name
			action.type.stage = result.success ? SUCCEEDED_FETCH : FAILED_FETCH
			return action
		},
		fetch: (args, username="guest") => {
			return dispatch => {
				dispatch(this.request())
				return this._fetch(options.resource, username, {
					method: 'POST',
					args: args,
				})
				.then(json => {
					dispatch(this.received(json))
				})
				.catch(err => {
					dispatch(err)
				})
			}
		},
		_fetch: (resource, username, args) => {
			return serverFetch(options.admin? '/admin/api': '/api', resource, username, args)
		}
	}
}