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
	DIALOG_WAITING, DIALOG_DONE, DIALOG_ERROR,
} from '../../../common/dialog'

test("signup with initialState and the empty action", t => {
	var resultState = signup(undefined, {})

	t.immutableEqual(resultState, Map({
		username: "guest",
		token: null,
		accessLevel: "guest",
		dialog: false,
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
		accessLevel: "guest",
		dialog: Map({
			status: DIALOG_WAITING,
			error: null,
		}), 
	}), "dialog object is created and status is added")

	t.end()
})

test("signup with initialState and receivedSignup:success", t => {
	var resultState = signup(undefined, {
		type: SUCCEEDED_SIGNUP,
		username: "signedup-username",
		token: "random-string",
		accessLevel: "free",
	})

	t.immutableEqual(resultState, Map({
		username: "signedup-username",
		token: "random-string",
		accessLevel: "free",
		dialog: Map({
			status: DIALOG_DONE,
			error: null
		}),
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
		accessLevel: "guest",
		dialog: Map({
			status: DIALOG_ERROR,
			error: List([
				LONG_USERNAME,
				DUPLICATE_EMAIL,
				SHORT_PASSWORD,
			])
		}), 
	}), "signupDialog contains errors correctly")
	t.end()
})

test("signup with failedSignup and requestSignup", t => {
	var state = Map({
		username: "guest",
		token: null,
		accessLevel: "guest",
		dialog: Map({
			status: DIALOG_ERROR,
			error: List([
				LONG_USERNAME,
				DUPLICATE_EMAIL,
				COMMON_PASSWORD,
			]),
		}), 
	})
	var resultState = signup(state, {
		type: REQUEST_SIGNUP,
	})

	t.immutableEqual(resultState, Map({
		username: "guest",
		token: null,
		accessLevel: "guest",
		dialog: Map({
			status: DIALOG_WAITING,
			error: null,
		}), 
	}), "waitingSignUp became true")

	t.end()
})

test("signup with initialState and receivedSignup:success", t => {
	var state = Map({
		username: "guest",
		token: null,
		accessLevel: "guest",
		dialog: Map({
			status: DIALOG_ERROR,
			error: List([
				LONG_USERNAME,
				COMMON_PASSWORD,
			]),
		}), 
	})
	var resultState = signup(state, {
		type: SUCCEEDED_SIGNUP,
		username: "finallypassed",
		token: "random-string-2",
		accessLevel: "gold",
	})

	t.immutableEqual(resultState, Map({
		username: "finallypassed",
		token: "random-string-2",
		accessLevel: "gold",
		dialog: Map({
			status: DIALOG_DONE,
			error: null,
		})
	}), "username, token should be indentical with action. waitingSignUp and signupDialog should be false")

	t.end()
})

test("signup with initialState and receivedSignup:failed", t => {
	var state = Map({
		username: "guest",
		token: null,
		accessLevel: "guest",
		dialog: Map({
			status: DIALOG_ERROR,
			error: List([
				DUPLICATE_EMAIL,
				COMMON_PASSWORD,
			]),
		}), 
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
		accessLevel: "guest",
		dialog: Map({
			status: DIALOG_ERROR,
			error: List([
				SHORT_PASSWORD,
			])
		}), 
	}), "signupDialog contains new errors correctly")
	t.end()
})