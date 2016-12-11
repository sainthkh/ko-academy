import { Map, List } from 'immutable'

import {
	REQUEST_SIGNUP, SUCCEEDED_SIGNUP,
	FAILED_SIGNUP, SERVER_DOWN, PAGE_NOT_FOUND, INTERNAL_SERVER_ERROR, OTHER_ERROR, 
} from './action'

export default function username(state = "", action) {
	switch(action.type) {
		case "SUCCESS_LOGIN":
			return action.username
		default:
			return state
	}
} 

const initialState = Map<string, any>({
	username: "guest",
	token: null,
	waitingSignUp: false,
	signupDialog: Map({
		on: true,
		error: null,
	}), 
	error: null,
})

export function signup(state=initialState, action) {
	switch(action.type) {
		case REQUEST_SIGNUP:
			return state.set('waitingSignUp', true)
		case SUCCEEDED_SIGNUP:
			return state.withMutations(state => {
				state.set('username', action.username)
					.set('token', action.token)
					.set('waitingSignUp', false)
					.set('signupDialog', false)
			})
		case FAILED_SIGNUP:
			return state.withMutations(state => {
				state.set('waitingSignUp', false)
					.set('signupDialog', Map({
						on: true, 
						error: List(action.error)
					}))
			})
		case SERVER_DOWN:
		case PAGE_NOT_FOUND:
		case INTERNAL_SERVER_ERROR:
		case OTHER_ERROR:
		 	return state.withMutations(state => {
				 state.set('waitingSignUp', false)
				 	.set('signupDialog', false)
					.set('error', Map({
						type: action.type,
						obj: action.error? Map(action.error) : null,
					}))
			 })
	}
	return state
}