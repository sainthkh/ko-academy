const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const sinonPromised = require('sinon-as-promised')

import {config} from '../../../config'

import { 
	FAILED_SIGNUP, SUCCEEDED_SIGNUP, receivedSignup, 
	REQUEST_SIGNUP, requestSignup,
	LONG_USERNAME, DUPLICATE_EMAIL, SHORT_PASSWORD, COMMON_PASSWORD,
} from '../action'

import {
	SERVER_DOWN, PAGE_NOT_FOUND, INTERNAL_SERVER_ERROR, OTHER_ERROR
} from '../../../data/fetch'

test("fetchSignupResult with correct userdata", t => {
	testRequestedSignup(t)
	testCorrectAPICall(t)

	var username = "testuser3"
	var token = "random token 3"
	var fetch = sinon.stub().resolves({
		success: true,
		username,
		token
	})	
	var fetchSignupResult = mockFetchSignupResult(fetch)
	var thunk = fetchSignupResult({
		username,
		email: "another@gmail.com",
		password: "hello secret",
	})
	var dispatch = sinon.spy()
	thunk(dispatch)
	.then(() => {
		t.deepEqual(dispatch.secondCall.args[0], {
			type: SUCCEEDED_SIGNUP,
			username,
			token,
		}, "Correct Action: Succeeded Signup")
		
		testDispatchCallCount(t, dispatch, 2)//*/
		t.end()
	})
})

test("fetchSignupResult with incorrect userdata", t => {
	testRequestedSignup(t)
	testCorrectAPICall(t)

	var long_username = "aasdaaa asdliuaksadfujm asfd asdluf;ljkas dfasdfasdfau"
	var common_password = "12345678"
	var fetch = sinon.stub().resolves({
		success: false,
		error: {
			LONG_USERNAME,
			DUPLICATE_EMAIL,
			COMMON_PASSWORD,
		}
	})
	var fetchSignupResult = mockFetchSignupResult(fetch)
	var thunk = fetchSignupResult({
		username: long_username,
		email: "duplicate@email.co.ru",
		password: common_password,
	})
	var dispatch = sinon.spy()
	thunk(dispatch)
	.then(() => {
		t.deepEqual(dispatch.secondCall.args[0], {
			type: FAILED_SIGNUP,
			error: {
				LONG_USERNAME,
				DUPLICATE_EMAIL,
				COMMON_PASSWORD,
			}
		}, "Correct Action: Failed Signup")

		testDispatchCallCount(t, dispatch, 2)
		t.end()
	})
})

test("fetchSignupResult with short password", t => {
	testRequestedSignup(t)
	testCorrectAPICall(t)

	var fetchSignupResult = mockFetchSignupResult()
	var thunk = fetchSignupResult({
		username: "normal-user",
		email: "hello@world.net",
		password: "short"
	})
	var dispatch = sinon.spy()
	thunk(dispatch)
	t.deepEqual(dispatch.firstCall.args[0], {
		type: FAILED_SIGNUP,
		error: [
			SHORT_PASSWORD
		]
	})
	t.end()
})

const testRequestedSignup = t => {
	var req = {
		username: "andrew",
		email: "email@naver.com",
		password: "p@ssw0rd"
	}
	var fetchSignupResult = mockFetchSignupResult()
	var thunk = fetchSignupResult(req)
	var dispatch = sinon.spy()
	thunk(dispatch)
	.then(() => {
		t.equal(dispatch.firstCall.args[0].type, REQUEST_SIGNUP, "request started correctly")
	})
}

const testDispatchCallCount = (t, dispatch, count) => {
	t.equal(dispatch.callCount, count, `dispatch is called ${count} time(s)`)
}

const testCorrectAPICall = t => {
	var req = {
		username: "good-tester",
		email: "goodmail@gmail.com",
		password: "random gen token"
	}
	var fetch = sinon.spy().resolves({
		status: 200,
		json: () => (req)
	})
	var fetchSignupResult = mockFetchSignupResult(fetch)
	var thunk = fetchSignupResult(req)
	var dispatch = sinon.spy()
	thunk(dispatch)
	.then(() => {
		// correct post call. 
		t.equal(fetch.firstCall.args[0], '/create-user', "correct API path")
		t.deepEqual(fetch.firstCall.args[1], "guest", "auth name should be guest when signing up")
		t.deepEqual(fetch.firstCall.args[2].args, req, "user object should not be changed")
		t.equal(fetch.callCount, 1, "fetch should be called only once")
	})
}

const mockFetchSignupResult = (fetch?) => {
	var fetch = fetch ? fetch: sinon.stub().resolves({})
	var action = proxyquire('../action', {
		'../../data/fetch': {
			fetch: fetch.promised? fetch.promised: fetch,
		}
	})

	return action.fetchSignupResult
}

test("requestSignup in any condition", t => {
	var action = requestSignup({
		username: "testuser2",
		email: "my@email.com",
		password: "secret words",
	})

	t.deepEqual(action, {
		type: REQUEST_SIGNUP
	}, "returned correct action object with only type")

	t.end()
})

test("receivedSignup in any condition", t => {
	succeededSignup("returned correct action object with username and token", t)
	failedSignup("returned correct action object with correct message", t)
	t.end()
})

const succeededSignup = (msg, t) => {
	var action = receivedSignup({
		success: true,
		username: "testuser",
		token: "random token"
	})

	t.deepEqual(action, {
		type: SUCCEEDED_SIGNUP,
		username: "testuser",
		token: "random token"
	}, msg)
}

const failedSignup = (msg, t) => {
	var action = receivedSignup({
		success: false,
		error: [
			LONG_USERNAME,
			DUPLICATE_EMAIL,
			SHORT_PASSWORD,
		]
	})

	t.deepEqual(action, {
		type: FAILED_SIGNUP,
		error: [
			LONG_USERNAME,
			DUPLICATE_EMAIL,
			SHORT_PASSWORD,
		]
	}, msg)
}