import { Map, List } from 'immutable'

import {
	REQUEST_SUBSCRIBE, SUCCEEDED_SUBSCRIBE,
	FAILED_SUBSCRIBE,
} from './action'

import {
	DIALOG_WAITING, DIALOG_DONE, DIALOG_ERROR,
} from '../../Dialog'

export function subscribe(state, action) {
	switch(action.type) {
		case REQUEST_SUBSCRIBE:
			return state.set('dialog', Map({
				status: DIALOG_WAITING,
				error: null,
			}))
		case SUCCEEDED_SUBSCRIBE:
			return state.withMutations(state => {
				state.set('dialog', Map({
						status: DIALOG_DONE,
						error: null
					}))
			})
		case FAILED_SUBSCRIBE:
			return state.set('dialog', Map({
				status: DIALOG_ERROR, 
				error: List(action.error)
			}))
	}
	return state
}