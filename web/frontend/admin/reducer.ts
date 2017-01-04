import { combineReducers } from 'redux'
import { fetchReducer } from '../common/lib/fetch'

const reducer = combineReducers({
	auth: fetchReducer({
		name: "login",
		fail: () => ({}),
		success: action => ({ token: action.token})
	}),
})

export default reducer