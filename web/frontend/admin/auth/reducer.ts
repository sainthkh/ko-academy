import {
	REQUEST_FETCH, SUCCEEDED_FETCH, FAILED_FETCH
} from '../../common/lib/fetch-action'

import {
	immutable
} from '../../common/lib/immutable'

export function auth(state = { stage: null, token: null }, action) {
	switch(action.type.stage) {
		case REQUEST_FETCH:
			return immutable(state, {
				stage: REQUEST_FETCH,
			})
		case SUCCEEDED_FETCH:
			return immutable(state, {
				stage: SUCCEEDED_FETCH,
				token: action.token,
			})
		case FAILED_FETCH:
			return immutable(state, {
				stage: FAILED_FETCH
			})
	}
	return state
}