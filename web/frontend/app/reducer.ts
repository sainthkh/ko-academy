import { combineReducers } from 'redux'
import { auth } from './pages/common/auth/reducer'

const reducer = combineReducers({
	auth,
})

export default reducer