import { combineReducers } from 'redux'
import { fetchReducer } from '../common/lib/fetch'

const reducer = (state = {
	auth: {},
	fetch: {}
}, action) => {
	switch(action.type) {
		case "FETCH":
			return fetchReducer(state, action)
		case "INIT_AUTH":
			return Object.assign({}, state, {
				auth: {
					username: action.username,
					accessLevel: action.accessLevel,
				}
			})
		default:
			return state
	}
}

export default reducer