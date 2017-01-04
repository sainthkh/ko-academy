import {
	REQUEST_FETCH, FAILED_FETCH, SUCCEEDED_FETCH
} from './action'

export interface FetchProps {
	waiting: boolean
	failed: boolean
	succeeded: boolean
	fetch: (any) => void
	error?: any
}

export function fetchProps(state) {
	return {
		waiting: state.stage == REQUEST_FETCH,
		failed: state.stage == FAILED_FETCH,
		succeeded: state.stage == SUCCEEDED_FETCH,
	} 
}