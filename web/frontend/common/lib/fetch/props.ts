import {
	REQUEST_FETCH, FAILED_FETCH, SUCCEEDED_FETCH
} from './action'

export interface FetchProps {
	waiting: boolean
	failed: boolean
	succeeded: boolean
	content: any
	submit: (any) => void
	error?: any
}

export function fetchProps(state) {
	return {
		waiting: state.stage == REQUEST_FETCH,
		failed: state.stage == FAILED_FETCH,
		succeeded: state.stage == SUCCEEDED_FETCH,
	} 
}

import { FetchStage } from './action'

export function fetchProps2(fetch) {
	let error = {}
	if (fetch.error) {
		fetch.error.forEach(e => {
			error[e] = true
		})
	}
	return {
		waiting: fetch.stage == FetchStage.REQUEST,
		failed: fetch.stage == FetchStage.FAILED,
		succeeded: fetch.stage == FetchStage.SUCCEEDED,
		content: fetch.content,
		error,
	} 
}