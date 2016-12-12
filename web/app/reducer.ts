import { combineReducers } from 'redux'
import { signup } from './auth/reducer'

const reducer = combineReducers({
	signup,
})

export default reducer