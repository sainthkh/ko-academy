import { fetch as serverFetch } from './fetch'
import { getToken } from '../token'

import { addProcessor } from './reducer'

export function fetchPackage(options:FetchReduxGeneratorArgs) {
	return {
		load: load(options),
		submit: submit(options),
	}
}

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
	toFetch?: (any) => any
}

export enum FetchPurpose {
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
		onSucceeded, onFailed, onErrored, toFetch,
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
		fetch: toFetch ? toFetch : () => ({}),
	})

	return (args) => {
		return dispatch => {
			dispatch(request())
			return serverFetch({
				admin,
				args,
				token: getToken(),
				method, 
				resource,
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