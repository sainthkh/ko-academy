import { combineReducers } from 'redux'
import { fetchReducer } from '../common/lib/fetch'

const reducer = (state = {
	fetch: {}
}, action) => {
	switch(action.type) {
		case "FETCH":
			return fetchReducer(state, action)
		case "@@redux/INIT":
			return state
	}
}

export default reducer