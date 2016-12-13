import { Map, List } from 'immutable'

import { 
	OPEN_DIALOG, CLOSE_DIALOG,  
} from './action'

const initState = Map({
	open: false
})

export function showDialog(state=initState, action) {
	switch(action.type) {
		case OPEN_DIALOG:
			return state.set('open', true)
		case CLOSE_DIALOG:
			return state.set('open', false)
		default:
			return state
	}
}