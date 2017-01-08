import { immutable } from '../immutable'
import { FetchStage } from './action'

var processors = {}
export function addProcessor(id, processor) {
	processors[id] = processor
}

export function fetchReducer(state={
	fetch: {}
}, action) {
	if(action.type != "FETCH") {
		return state
	}
	let processor = processors[action.id]
	state = immutable(state, fetchState(action, processor.fetch(action)))
	switch(action.stage) {
		case FetchStage.REQUEST:
			return state
		case FetchStage.SUCCEEDED:
			return immutable(state, processor.success(action))
		case FetchStage.FAILED:
			return immutable(state, processor.fail(action))
		case FetchStage.ERRORED:
			return immutable(state, processor.error(action))
		default:
			return state
	}
}

function fetchState(action, more) {
	const { id, stage, purpose, content, error } = action
	return {
		fetch: Object.assign({
			id, stage, purpose, content, error,
		}, more)
	}
}