import { Map, List } from 'immutable'

import {
	REQUEST_SIGNUP, SUCCEEDED_SIGNUP,
	FAILED_SIGNUP,
} from './action'

import {
	DIALOG_WAITING, DIALOG_DONE, DIALOG_ERROR,
} from '../../Dialog'

export function signup(state, action) {
	switch(action.type) {
		case REQUEST_SIGNUP:
			return state.set('dialog', Map({
				status: DIALOG_WAITING,
				error: null,
			}))
		case SUCCEEDED_SIGNUP:
			return state.withMutations(state => {
				state.set('username', action.username)
					.set('token', action.token)
					.set('accessLevel', action.accessLevel)
					.set('dialog', Map({
						status: DIALOG_DONE,
						error: null
					}))
			})
		case FAILED_SIGNUP:
			return state.set('dialog', Map({
				status: DIALOG_ERROR, 
				error: List(action.error)
			}))
	}
	return state
}