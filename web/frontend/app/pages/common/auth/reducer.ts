import { combineReducers } from 'redux'
import { fetchReducer } from '../../../../common/lib/fetch'
import { immutable } from '../../../../common/lib/immutable'

import { signup } from './signup/reducer'
import { login } from './login/reducer'

export function auth(state:any={
	subscribe: {},
	signup: {},
	login: {},
}, action) {
	switch(action.type.name) {
		case "subscribe":
			return immutable(state, {
				subscribe: fetchReducer({
					name: "subscribe",
					fail: action => ({ error: action.error }), 
				})(state.subscribe, action)
			})
		case "signup":
			let newState = fetchReducer({
				name: "signup",
				fail: action => ({ 
					error: action.error,
					feedback: action.feedback,
				}),
				success: action => ({
					username: action.username,
					accessLevel: action.accessLevel
				})
			})(state.signup, action)
			return immutable(state, {
				signup: newState,
				username: newState.username,
				accessLevel: newState.accessLevel,
			})
		default: 
			return state
	}
}