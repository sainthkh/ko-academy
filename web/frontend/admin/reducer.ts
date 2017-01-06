import { combineReducers } from 'redux'
import { fetchReducer } from '../common/lib/fetch'

const reducer = combineReducers({
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
	course: fetchReducer({
		name: "save-course",
	}),
})

export default reducer