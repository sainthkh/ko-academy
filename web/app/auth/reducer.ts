import { Map } from 'immutable'

import {
	REQUEST_SIGNUP, SUCCEEDED_SIGNUP,
} from './action'

export default function username(state = "", action) {
	switch(action.type) {
		case "SUCCESS_LOGIN":
			return action.username
		default:
			return state
	}
} 

const initialState = Map({
	username: "guest",
	token: null,
	onSigningUp: false,
})

export function signup(state=initialState, action) {
	switch(action.type) {
		case REQUEST_SIGNUP:
			return state.set('onSigningUp', true)
		case SUCCEEDED_SIGNUP:
			return state.withMutations( state => {
				state.set('username', action.username)
					.set('token', action.token)
					.set('onSigningUp', false)
			})
	}
	return state
}