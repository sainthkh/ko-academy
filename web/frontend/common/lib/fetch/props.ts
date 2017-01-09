import { FetchStage, FetchPurpose } from './action'

export interface FetchProps {
	waiting: boolean
	failed: boolean
	succeeded: boolean
	loading: boolean
	content: any
	submit: (any) => void
	load: (any) => void
	error: any
}

export function fetchProps(fetch) {
	let error = {}
	if (Array.isArray(fetch.error)) {
		fetch.error.forEach(e => {
			error[e] = true
		})
	}

	let rest = Object.assign({}, fetch)
	let defaultKeys = ["id", "stage", "purpose", "content", "error"]
	defaultKeys.forEach(k => {
		delete rest[k]
	})
	
	return Object.assign({
		waiting: fetch.purpose == FetchPurpose.SUBMIT && fetch.stage == FetchStage.REQUEST,
		failed: fetch.stage == FetchStage.FAILED,
		succeeded: fetch.stage == FetchStage.SUCCEEDED,
		content: fetch.content ? fetch.content: {},
		loading: fetch.purpose == FetchPurpose.LOAD && fetch.stage == FetchStage.REQUEST,
		error,
	}, rest) as FetchProps
}

export function defaultFetchProps() {
	return {
		waiting: false,
		failed: false,
		succeeded: false,
		content: {},
		loading: true,
		error: {},
	}
}