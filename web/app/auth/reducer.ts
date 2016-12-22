import { Map, List } from 'immutable'

import { signup } from './signup/reducer'
import { login } from './login/reducer'

import {
	REQUEST_SIGNUP, SUCCEEDED_SIGNUP, FAILED_SIGNUP, 
} from './signup/action'

import {
	REQUEST_LOGIN, SUCCEEDED_LOGIN, FAILED_LOGIN,
} from './login/action'

const initialState = Map<string, any>({
	username: "guest",
	token: null,
	accessLevel: "guest",
	dialog: false,
})

export function auth(state=initialState, action) {
	switch(action.type) {
		case REQUEST_SIGNUP:
		case SUCCEEDED_SIGNUP:
		case FAILED_SIGNUP:
			return signup(state, action)
		case REQUEST_LOGIN:
		case SUCCEEDED_LOGIN:
		case FAILED_LOGIN:
			return login(state, action)
	}
	return state
}