const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const sinonPromised = require('sinon-as-promised')

import {config} from '../../config'

import { 
	FAILED_SIGNUP, SUCCEEDED_SIGNUP, receivedSignup, 
	REQUEST_SIGNUP, requestSignup,
	serverDown, otherError, SERVER_DOWN, OTHER_ERROR,
	LONG_USERNAME, DUPLICATE_EMAIL, SHORT_PASSWORD, COMMON_PASSWORD,
	pageNotFound, internalServerError,
	PAGE_NOT_FOUND, INTERNAL_SERVER_ERROR
} from '../action'

test("fetchSignupResult with correct userdata", t => {
	testRequestedSignup(t)
	testCorrectAPICall(t)

	var username = "testuser3"
	var token = "random token 3"
	var fetch = sinon.stub().resolves({
		status: 200,
		json: () => ({
			success: true,
			username,
			token
		})	
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
		status: 200,
		json: () => ({
			success: false,
			error: {
				LONG_USERNAME,
				DUPLICATE_EMAIL,
				COMMON_PASSWORD,
			}
		})
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

test("fetchSignupResult with server down", t => {
	testRequestedSignup(t)
	testCorrectAPICall(t)

	var fetch = sinon.spy().rejects({
		code: "ECONNREFUSED"
	})
	var fetchSignupResult = mockFetchSignupResult(fetch)
	var thunk = fetchSignupResult({
		username: "validuser",
		email: "validemail@yahoo.com",
		password: "p@@sswor!d"
	})
	
	var dispatch = sinon.spy()
	thunk(dispatch)
	.then(err => {
		t.equal(dispatch.secondCall.args[0].type, SERVER_DOWN, "Action type: server down")

		testDispatchCallCount(t, dispatch, 2)
		t.end()
	})
})

test("fetchSignupResult with page not found", t => {
	testRequestedSignup(t)
	testCorrectAPICall(t)

	var fetch = sinon.spy().resolves({
		status: 404
	})
	var fetchSignupResult = mockFetchSignupResult(fetch)
	var thunk = fetchSignupResult({
		username: "validuser",
		email: "validemail@yahoo.com",
		password: "p@@sswor!d"
	})
	
	var dispatch = sinon.spy()
	thunk(dispatch)
	.then(err => {
		t.equal(dispatch.secondCall.args[0].type, PAGE_NOT_FOUND, "Action type: page not found")

		testDispatchCallCount(t, dispatch, 2)
		t.end()
	})
})

test("fetchSignupResult with internal server error", t => {
	testRequestedSignup(t)
	testCorrectAPICall(t)

	var fetch = sinon.spy().resolves({
		status: 500
	})
	var fetchSignupResult = mockFetchSignupResult(fetch)
	var thunk = fetchSignupResult({
		username: "validuser",
		email: "validemail@yahoo.com",
		password: "p@@sswor!d"
	})
	
	var dispatch = sinon.spy()
	var getState = sinon.stub().returns({
		username: "guest"
	})
	thunk(dispatch, getState)
	.then(err => {
		t.equal(dispatch.secondCall.args[0].type, INTERNAL_SERVER_ERROR, "Action type: Internal server error")

		testDispatchCallCount(t, dispatch, 2)
		t.end()
	})
})

test("fetchSignupResult with other error", t => {
	testRequestedSignup(t)
	testCorrectAPICall(t)

	var fetch = sinon.spy().resolves({
		status: 504
	})
	var fetchSignupResult = mockFetchSignupResult(fetch)
	var thunk = fetchSignupResult({
		username: "validuser",
		email: "validemail@yahoo.com",
		password: "p@@sswor!d"
	})
	
	var dispatch = sinon.spy()
	var getState = sinon.stub().returns({
		username: "guest"
	})
	thunk(dispatch, getState)
	.then(err => {
		t.equal(dispatch.secondCall.args[0].type, OTHER_ERROR, "Action type: Other Error")

		testDispatchCallCount(t, dispatch, 2)
		t.end()
	})
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
		t.deepEqual(fetch.firstCall.args[1].username, "guest", "auth name should be guest when signing up")
		t.equal(fetch.callCount, 1, "fetch should be called only once")
		t.equal(fetch.firstCall.args[0], '/create-user', "correct API path")
		t.deepEqual(fetch.firstCall.args[1].args, req, "user object should not be changed")
		console.log('')
	})
}

const mockFetchSignupResult = (fetch?) => {
	var fetch = fetch ? fetch: sinon.spy().resolves({
		status: 200,
		json: () => ({})
	})
	var action = proxyquire('../action', {
		'../data/fetch': {
			default: fetch.promised? fetch.promised: fetch,
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

test("serverDown in any condition", t => {
	var action = serverDown()

	t.deepEqual(action, {
		type: SERVER_DOWN
	}, "returned an object which has only type: SERVER_DOWN")

	t.end()
})

test("pageNotFound in any condition", t => {
	var action = pageNotFound()

	t.deepEqual(action, {
		type: PAGE_NOT_FOUND
	}, "returned an object which has only type: PAGE_NOT_FOUND")

	t.end()
})

test("internalServerError in any condition", t => {
	var err = {code:'FetchError'}
	var action = internalServerError(err, "guest")
	var currentTime = action.error.time

	t.deepEqual(action, {
		type: INTERNAL_SERVER_ERROR,
		error: {
			obj: err,
			username: "guest",
			time: currentTime,
		}
	}, "returned an object which has only type: PAGE_NOT_FOUND and err object")

	t.end()
})

test("otherError in any condition", t => {
	var err = {code:'TestError'}
	var action = otherError(err, "random user") 
	var time = action.error.time //to check current time

	t.deepEqual(action, {
		type: OTHER_ERROR,
		error: {
			obj: err,
			username: "random user", 
			time: time,
		}
	}, "returned a correct object with type: OTHER_ERROR and other values liek error, username, time")

	t.end()
})