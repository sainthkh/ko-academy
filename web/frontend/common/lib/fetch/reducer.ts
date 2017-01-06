import {
	REQUEST_FETCH, SUCCEEDED_FETCH, FAILED_FETCH
} from './action'

import {
	immutable
} from '../immutable'

interface FetchReducerArgs {
	name: string
	success?: (action:any) => any
	fail?: (action:any) => any
}

export function fetchReducer(options:FetchReducerArgs) {
	options.success = options.success ? options.success : () => ({})
	options.fail = options.fail ? options.fail : () => ({})
	
	return (state={}, action) => {
		if(action.type.name != options.name) {
			return state
		}
		switch(action.type.stage) {
			case REQUEST_FETCH:
				return immutable(state, {
					stage: REQUEST_FETCH,
				})
			case SUCCEEDED_FETCH:
				return immutable(state, {
					stage: SUCCEEDED_FETCH,
				}, options.success(action))
			case FAILED_FETCH:
				return immutable(state, {
					stage: FAILED_FETCH
				}, options.fail(action))
		}
		return state
	}
}