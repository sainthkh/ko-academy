const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('tape-for-immutable')
import { Map, List } from 'immutable'

import {
	signup
} from '../reducer'

import {
	REQUEST_SIGNUP, SUCCEEDED_SIGNUP, FAILED_SIGNUP,
	LONG_USERNAME, DUPLICATE_EMAIL, COMMON_PASSWORD, SHORT_PASSWORD,
} from '../action'

import {
	SERVER_DOWN, PAGE_NOT_FOUND, INTERNAL_SERVER_ERROR, OTHER_ERROR,
} from '../../../data/fetch'

test("signup with initialState and the empty action", t => {
	var resultState = signup(undefined, {})

	t.immutableEqual(resultState, Map({
		username: "guest",
		token: null,
		waitingSignUp: false,
		signupDialog: Map({
			on: true,
			error: null,
		}), 
		error: null,
	}), "current state is returned")
	t.end()
})

test("signup with initialState and requestSignup", t => {
	var resultState = signup(undefined, {
		type: REQUEST_SIGNUP,
	})

	t.immutableEqual(resultState, Map({
		username: "guest",
		token: null,
		waitingSignUp: true,
		signupDialog: Map({
			on: true,
			error: null,
		}), 
		error: null,
	}), "waitingSignUp became true")

	t.end()
})

test("signup with initialState and receivedSignup:success", t => {
	var resultState = signup(undefined, {
		type: SUCCEEDED_SIGNUP,
		username: "signedup-username",
		token: "random-string",
	})

	t.immutableEqual(resultState, Map({
		username: "signedup-username",
		token: "random-string",
		waitingSignUp: false,
		signupDialog: false,
		error: null,
	}), "username, token should be indentical with action. waitingSignUp and signupDialog should be false")

	t.end()
})

test("signup with initialState and receivedSignup:failed", t => {
	var resultState = signup(undefined, {
		type: FAILED_SIGNUP,
		error: [
			LONG_USERNAME,
			DUPLICATE_EMAIL,
			SHORT_PASSWORD,
		]
	})

	t.immutableEqual(resultState, Map({
		username: "guest",
		token: null,
		waitingSignUp: false,
		signupDialog: Map({
			on: true,
			error: List([
				LONG_USERNAME,
				DUPLICATE_EMAIL,
				SHORT_PASSWORD,
			])
		}), 
		error: null,
	}), "signupDialog contains errors correctly")
	t.end()
})

test("signup with initialState and serverDown", t => {
	var resultState = signup(undefined, {
		type: SERVER_DOWN,
	})

	t.immutableEqual(resultState, Map({
		username: "guest",
		token: null,
		waitingSignUp: false,
		signupDialog: false,
		error: Map({
			type: SERVER_DOWN,
			obj: null,
		})
	}), "signupDialog is closed(false) and correct error is on.")
	t.end()
})

test("signup with initialState and pageNotFound", t => {
	var resultState = signup(undefined, {
		type: PAGE_NOT_FOUND,
	})

	t.immutableEqual(resultState, Map({
		username: "guest",
		token: null,
		waitingSignUp: false,
		signupDialog: false,
		error: Map({
			type: PAGE_NOT_FOUND,
			obj: null,
		})
	}), "signupDialog is closed(false) and correct error is on.")
	t.end()
})

test("signup with initialState and internalServerError", t => {
	var currentTime = new Date()
	var err = {
		obj: new Error('Testing feature'),
		username: "guest",
		time: currentTime,
	}
	var resultState = signup(undefined, {
		type: INTERNAL_SERVER_ERROR,
		error: err
	})

	t.immutableEqual(resultState, Map({
		username: "guest",
		token: null,
		waitingSignUp: false,
		signupDialog: false,
		error: Map({
			type: INTERNAL_SERVER_ERROR,
			obj: Map(err),
		})
	}), "signupDialog is closed(false) and correct error is on.")
	t.end()
})

test("signup with initialState and otherError", t => {
	var currentTime = new Date()
	var err = {
		obj: new Error('Unexpected Error'),
		username: "guest",
		time: currentTime,
	}
	var resultState = signup(undefined, {
		type: OTHER_ERROR,
		error: err
	})

	t.immutableEqual(resultState, Map({
		username: "guest",
		token: null,
		waitingSignUp: false,
		signupDialog: false,
		error: Map({
			type: OTHER_ERROR,
			obj: Map(err),
		})
	}), "signupDialog is closed(false) and correct error is on.")
	t.end()
})

test("signup with failedSignup and requestSignup", t => {
	var state = Map({
		username: "guest",
		token: null,
		waitingSignUp: false,
		signupDialog: Map({
			on: true,
			error: List([
				LONG_USERNAME,
				DUPLICATE_EMAIL,
				COMMON_PASSWORD,
			]),
		}), 
		error: null,
	})
	var resultState = signup(state, {
		type: REQUEST_SIGNUP,
	})

	t.immutableEqual(resultState, Map({
		username: "guest",
		token: null,
		waitingSignUp: true,
		signupDialog: Map({
			on: true,
			error: List([
				LONG_USERNAME,
				DUPLICATE_EMAIL,
				COMMON_PASSWORD,
			]),
		}), 
		error: null,
	}), "waitingSignUp became true")

	t.end()
})

test("signup with initialState and receivedSignup:success", t => {
	var state = Map({
		username: "guest",
		token: null,
		waitingSignUp: false,
		signupDialog: Map({
			on: true,
			error: List([
				LONG_USERNAME,
				COMMON_PASSWORD,
			]),
		}), 
		error: null,
	})
	var resultState = signup(state, {
		type: SUCCEEDED_SIGNUP,
		username: "finallypassed",
		token: "random-string-2",
	})

	t.immutableEqual(resultState, Map({
		username: "finallypassed",
		token: "random-string-2",
		waitingSignUp: false,
		signupDialog: false,
		error: null,
	}), "username, token should be indentical with action. waitingSignUp and signupDialog should be false")

	t.end()
})

test("signup with initialState and receivedSignup:failed", t => {
	var state = Map({
		username: "guest",
		token: null,
		waitingSignUp: false,
		signupDialog: Map({
			on: true,
			error: List([
				DUPLICATE_EMAIL,
				COMMON_PASSWORD,
			]),
		}), 
		error: null,
	})
	var resultState = signup(undefined, {
		type: FAILED_SIGNUP,
		error: [
			SHORT_PASSWORD,
		]
	})

	t.immutableEqual(resultState, Map({
		username: "guest",
		token: null,
		waitingSignUp: false,
		signupDialog: Map({
			on: true,
			error: List([
				SHORT_PASSWORD,
			])
		}), 
		error: null,
	}), "signupDialog contains new errors correctly")
	t.end()
})