const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const config = require('../config')

import { 
	FAILED_SIGNUP, SUCCEEDED_SIGNUP, receivedSignup, 
	REQUEST_SIGNUP, requestSignup,
	SERVER_DOWN, OTHER_ERROR,
	LONG_USERNAME, DUPLICATE_EMAIL, SHORT_PASSWORD, COMMON_PASSWORD,
} from './action'

test("fetchSignupResult with correct userdata", t => {
	testRequestedSignup(t)
	testBasicAuthCall(t)
	testCorrectAPICall(t)

	var username = "testuser3"
	var token = "random token 3"
	var post = sinon.stub().yields(null, null, null, {
		success: true,
		username,
		token
	})
	var fetchSignupResult = mockFetchSignupResult(null, post)
	var thunk = fetchSignupResult({
		username,
		email: "another@gmail.com",
		password: "hello secret",
	})
	var dispatch = sinon.spy()
	thunk(dispatch)

	t.deepEqual(dispatch.secondCall.args[0], {
		type: SUCCEEDED_SIGNUP,
		username,
		token,
	}, "Correct Action: Succeeded Signup")
	
	testDispatchCallCount(t, dispatch, 2)
	t.end()
})

test("fetchSignupResult with incorrect userdata", t => {
	testRequestedSignup(t)
	testBasicAuthCall(t)
	testCorrectAPICall(t)

	var long_username = "aasdaaa asdliuaksadfujm asfd asdluf;ljkas dfasdfasdfau"
	var common_password = "12345678"
	var post = sinon.stub().yields(null, null, null, {
		success: false,
		error: {
			LONG_USERNAME,
			DUPLICATE_EMAIL,
			COMMON_PASSWORD,
		}
	})
	var fetchSignupResult = mockFetchSignupResult(null, post)
	var thunk = fetchSignupResult({
		username: long_username,
		email: "duplicate@email.co.ru",
		password: common_password,
	})
	var dispatch = sinon.spy()
	thunk(dispatch)

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

test("fetchSignupResult with client error", t => {
	testRequestedSignup(t)
	testBasicAuthCall(t, 2)
	testCorrectAPICall(t)

	var err = {restCode:'ResourceNotFound'}
	var post = sinon.stub().yields(err, null, null, null)
	var fetchSignupResult = mockFetchSignupResult(null, post)
	var thunk = fetchSignupResult({
		username: "validuser",
		email: "validemail@yahoo.com",
		password: "p@@sswor!d"
	})
	
	var dispatch = sinon.spy()
	var getState = sinon.stub().returns({username:"guest"})
	thunk(dispatch, getState)

	var actionObj = dispatch.secondCall.args[0]
	t.equal(actionObj.type, OTHER_ERROR, "Action type: other error")
	t.deepEqual(actionObj.error, err, "correct error object")
	t.equal(actionObj.username, "guest", "username should be guest")
	t.equal(actionObj.time instanceof Date, true, "time should be Date object")

	testDispatchCallCount(t, dispatch, 2)
	t.end()
})

test("fetchSignupResult with server down", t => {
	testRequestedSignup(t)
	testBasicAuthCall(t, 1)
	testCorrectAPICall(t)

	var post = sinon.stub().yields({code:'ECONNREFUSED'}, null, null, null)
	var fetchSignupResult = mockFetchSignupResult(null, post)
	var thunk = fetchSignupResult({
		username: "validuser",
		email: "validemail@yahoo.com",
		password: "p@@sswor!d"
	})
	
	var dispatch = sinon.spy()
	thunk(dispatch)

	t.equal(dispatch.secondCall.args[0].type, SERVER_DOWN, "Action type: server down")

	testDispatchCallCount(t, dispatch, 2)
	t.end()
})

const testRequestedSignup = t => {
	var fetchSignupResult = mockFetchSignupResult()
	var thunk = fetchSignupResult({
		username: "andrew",
		email: "email@naver.com",
		password: "p@ssw0rd"
	})
	var dispatch = sinon.spy()
	thunk(dispatch)

	t.equal(dispatch.firstCall.args[0].type, REQUEST_SIGNUP, "request started correctly")
}

const testBasicAuthCall = t => {
	var basicAuth = sinon.spy()
	var fetchSignupResult = mockFetchSignupResult(basicAuth, null)
	var req = {
		username: "good-tester",
		email: "goodmail@gmail.com",
		password: "random gen token"
	}
	var thunk = fetchSignupResult(req)
	var dispatch = sinon.spy()
	thunk(dispatch)

	t.equal(basicAuth.firstCall.args[0], "guest", "correct auth name")
	t.equal(basicAuth.firstCall.args[1], config.apiKey, "correct auth api key")
}

const testDispatchCallCount = (t, dispatch, count) => {
	t.equal(dispatch.callCount, count, `dispatch is called ${count} time(s)`)
}

const testCorrectAPICall = t => {
	console.log('>>> Correct API Call Start')
	var post = sinon.spy()
	var fetchSignupResult = mockFetchSignupResult(null, post)
	var req = {
		username: "good-tester",
		email: "goodmail@gmail.com",
		password: "random gen token"
	}
	var thunk = fetchSignupResult(req)
	var dispatch = sinon.spy()
	thunk(dispatch)

	// correct post call. 
	t.equal(post.callCount, 1, "post is only called once")
	t.equal(post.firstCall.args[0], '/create-user', "correct API path")
	t.deepEqual(post.firstCall.args[1], req, "user object should not be changed")
	console.log('<<< Correct API Call Done')
}

const mockFetchSignupResult = (basicAuth, post) => {
	var basicAuth = basicAuth ? basicAuth:sinon.spy()
	var post = post ? post:sinon.spy()
	var action = proxyquire('./action', {
		'../data/rest': {
			basicAuth: basicAuth,
			post: post, 
		}
	})

	return action.fetchSignupResult
}

test("requestSignup", t => {
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

test("receivedSignup", t => {
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
		error: {
			LONG_USERNAME,
			DUPLICATE_EMAIL,
			SHORT_PASSWORD,
		}
	})

	t.deepEqual(action, {
		type: FAILED_SIGNUP,
		error: {
			LONG_USERNAME,
			DUPLICATE_EMAIL,
			SHORT_PASSWORD,
		}
	}, msg)
}