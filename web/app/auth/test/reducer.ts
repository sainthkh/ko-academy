const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('tape-for-immutable')
import { Map } from 'immutable'

import {
	signup
} from '../reducer'

import {
	REQUEST_SIGNUP, SUCCEEDED_SIGNUP,
} from '../action'

test("signup with initialState and the empty action", t => {
	var resultState = signup(undefined, {})

	t.immutableEqual(resultState, Map({
		username: "guest",
		token: null,
		onSigningUp: false,
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
		onSigningUp: true,
	}), "onSigningUp became true")

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
		onSigningUp: false,
	}), "username, token should be indentical with action. onSigningUp should be false")

	t.end()
})