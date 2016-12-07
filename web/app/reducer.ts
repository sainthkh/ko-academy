import { combineReducers } from 'redux'
import username from './auth/reducer'

const reducer = combineReducers({
	username,
})

export default reducer