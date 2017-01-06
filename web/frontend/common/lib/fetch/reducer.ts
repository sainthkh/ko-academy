import {
	REQUEST_FETCH, SUCCEEDED_FETCH, FAILED_FETCH
} from './action'

import {
	immutable
} from '../immutable'

interface FetchReducerArgs {
	name: string
	success?: (action:any) => any
	fail?: (action:any) => any
}

export function fetchReducer(options:FetchReducerArgs) {
	options.success = options.success ? options.success : () => ({})
	options.fail = options.fail ? options.fail : () => ({})

	return (state={}, action) => {
		if(action.type.name != options.name) {
			return state
		}
		switch(action.type.stage) {
			case REQUEST_FETCH:
				return immutable(state, {
					stage: REQUEST_FETCH,
				})
			case SUCCEEDED_FETCH:
				return immutable(state, {
					stage: SUCCEEDED_FETCH,
				}, options.success(action))
			case FAILED_FETCH:
				return immutable(state, {
					stage: FAILED_FETCH
				}, options.fail(action))
		}
		return state
	}
}

import { FetchStage } from './action'

var processors = {}
export function addProcessor(id, processor) {
	processors[id] = processor
}

export function fetchReducer2(state={
	fetch: {}
}, action) {
	if(action.type != "FETCH") {
		return state
	}
	state = immutable(state, fetchState(action))
	let processor = processors[action.id]
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

function fetchState(action) {
	const { id, stage, purpose, content, error } = action
	return {
		fetch: {
			id, stage, purpose, content, error,
		}
	}
}