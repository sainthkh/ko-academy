import { combineReducers } from 'redux'
import { fetchReducer, fetchReducer2 } from '../common/lib/fetch'

const reducer = (state = {
	auth: {},
	email: {
		broadcast: {},
		autoresponder: {},
	},
	fetch: {}
}, action) => {
	switch(action.type) {
		case "FETCH":
			return fetchReducer2(state, action)
		case "@@redux/INIT":
			return state
		default:
			return legacy(state, action)
	}
}

var legacy = combineReducers({
	auth: fetchReducer({
		name: "login",
		success: action => ({ token: action.token})
	}),
	email: combineReducers({
		broadcast: fetchReducer({
			name: "broadcast",
		}),
		autoresponder: fetchReducer({
			name: "autoresponder",
		})
	}),
})

export default reducer