import { combineReducers } from 'redux'
import { fetchReducer } from '../common/lib/fetch'

const reducer = combineReducers({
	auth: fetchReducer({
		name: "login",
		fail: () => ({}),
		success: action => ({ token: action.token})
	}),
	email: combineReducers({
		broadcast: fetchReducer({
			name: "broadcast",
			fail: () => ({}),
			success: () => ({})
		}),
		autoresponder: fetchReducer({
			name: "autoresponder",
			fail: () => ({}),
			success: () => ({})
		})
	}),
	course: fetchReducer({
		name: "save-course",
		fail: () => ({}),
		success: () => ({})
	}),
})

export default reducer