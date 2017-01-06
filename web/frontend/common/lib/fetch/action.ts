import { fetch as serverFetch } from './fetch'
import { fetch2 as serverFetch2 } from './fetch'

export const REQUEST_FETCH = "REQUEST_FETCH"
export const SUCCEEDED_FETCH = "SUCCEEDED_FETCH"
export const FAILED_FETCH = "FAILED_FETCH"
export const ERRORED_FETCH = "ERRORED_FETCH"

interface fetchActionArgs {
	name: string
	resource: string
	processResult?: (any) => any
	admin?: boolean
}

export function fetchAction(options:fetchActionArgs) {
	options.processResult = options.processResult ? options.processResult : () => ({})
	let request = () => ({
		type: {
			name: options.name,
			stage: REQUEST_FETCH
		}
	})

	let received = result => {
		let action = options.processResult(result)
		action.type = {
			name: options.name,
			stage: result.success ? SUCCEEDED_FETCH : FAILED_FETCH,
		}
		return action
	}

	let _fetch = (resource, username, args) => {
		return serverFetch(options.admin? '/admin/api': '/api', resource, username, args)
	}
	return (args, username="guest") => {
		return dispatch => {
			dispatch(request())
			args.token = localStorage.getItem("token")
			return _fetch(options.resource, username, {
				method: 'POST',
				args: args,
			})
			.then(json => {
				dispatch(received(json))
			})
			.catch(err => {
				dispatch({
					type: ERRORED_FETCH,
					error: err
				})
			})
		}
	}
}

import { addProcessor } from './reducer'

export function load(options:FetchReduxGeneratorArgs) {
	options.purpose = FetchPurpose.LOAD
	options.method = 'GET'
	options.id = `load-${options.id}`
	return fetchReduxGenerator(options)
}

export function submit(options:FetchReduxGeneratorArgs) {
	options.purpose = FetchPurpose.SUBMIT
	options.method = 'POST'
	options.id = `submit-${options.id}`
	return fetchReduxGenerator(options)
}

interface FetchReduxGeneratorArgs {
	id: string
	purpose?: FetchPurpose
	processResult?: (any) => any
	method?: string
	admin?: boolean
	resource: string
	onSucceeded?: (any) => any
	onFailed?: (any) => any
	onErrored?: (any) => any
}

enum FetchPurpose {
	LOAD,
	SUBMIT,
}

export enum FetchStage {
	REQUEST,
	SUCCEEDED,
	FAILED,
	ERRORED,
}

function fetchReduxGenerator(options:FetchReduxGeneratorArgs) {
	let type = "FETCH"
	const { 
		id, purpose, processResult, method, admin, resource, 
		onSucceeded, onFailed, onErrored,
	} = options
	let request = () => ({
		type,
		id,
		stage: FetchStage.REQUEST,
		purpose,
	})

	let received = result => {
		let process = processResult ? processResult : () => ({})
		return Object.assign({
			type, 
			id,
			stage: result.success ? FetchStage.SUCCEEDED : FetchStage.FAILED,
			purpose,
			content: result.content,
			error: result.error,
		}, process(result))
	}

	let errored = error => ({
		type,
		id,
		stage: FetchStage.ERRORED,
		purpose,
		error,
	})

	addProcessor(id, {
		success: onSucceeded ? onSucceeded : () => ({}),
		fail: onFailed ? onFailed : () => ({}),
		error: onErrored ? onErrored : () => ({}),
	})

	return (args) => {
		return dispatch => {
			dispatch(request())
			args.token = localStorage.getItem("token")
			return serverFetch2(admin ? '/admin/api': '/api', resource, {
				method,
				args,
			})
			.then(json => {
				dispatch(received(json))
			})
			.catch(err => {
				dispatch(errored(err))
			})
		}
	}
}