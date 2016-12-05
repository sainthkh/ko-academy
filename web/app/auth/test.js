const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const config = require('../config')

import { 
	FAILED_SIGNUP, SUCCEEDED_SIGNUP, receivedSignup, 
	REQUEST_SIGNUP, requestSignup,
} from './action'

test("fetchSignupResult with correct userdata", t => {
	testRequestedSignup(t)
	testBasicAuthCall(t)
	testCorrectAPICall(t)
	testDispatchCalledTwice(t)
	testFetchSignupSuccess(t)
	testFetchSignupFail(t)
	
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

const testDispatchCalledTwice = t => {
	var fetchSignupResult = mockFetchSignupResult(null, sinon.stub().yields(null, null, null, { success: false, msg: {}}))
	var thunk = fetchSignupResult({
		username: "andrew",
		email: "email@naver.com",
		password: "p@ssw0rd"
	})
	var dispatch = sinon.spy()
	thunk(dispatch)

	t.equal(dispatch.callCount, 2, "dispatch is called twice: request, receive")
}

const testCorrectAPICall = t => {
	console.log('>>> Correct API Call <<<')
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
	t.deepEqual(post.firstCall.args[1], req)
}

const testFetchSignupSuccess = t => {
	var username = "testuser3"
	var token = "random token 3"
	const {dispatch, basicAuth} = setupFetch({
		username,
		email: "another@gmail.com",
		password: "hello secret",
	}, {
		success: true,
		username,
		token
	}, null, t)

	t.deepEqual(dispatch.secondCall.args[0], {
		type: SUCCEEDED_SIGNUP,
		username,
		token,
	}, "Action: Succeeded Signup")
}

const testFetchSignupFail = t => {
	var username = "testuser4"
	var token = "random token 4"
	const {dispatch, basicAuth} = setupFetch({
		username,
		email: "another2mail@gmail.com",
		password: "hello secret 5",
	}, {
		success: false,
		msg: {
			username: "testuser is already in use",
			email: "your@email.com has been signed up. Do you want to find password?",
			password: "Password is too short. Password should be longer than 7 characters."
		}
	}, null, t)

	t.deepEqual(dispatch.secondCall.args[0], {
		type: FAILED_SIGNUP,
		msg: {
			username: "testuser is already in use",
			email: "your@email.com has been signed up. Do you want to find password?",
			password: "Password is too short. Password should be longer than 7 characters."
		}
	}, "Correct Action: Failed Signup")
}

const setupFetch = (req, res, err, t) => {
	var basicAuth = sinon.spy()
	var post = sinon.stub().yields(err, null, null, res)
	var fetchSignupResult = mockFetchSignupResult(basicAuth, post)
	var thunk = fetchSignupResult(req)
	var dispatch = sinon.spy()
	thunk(dispatch)

	return {
		dispatch,
		basicAuth,
	}
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
		msg: {
			username: "testuser is already in use",
			email: "your@email.com has been signed up. Do you want to find password?",
			password: "Password is too short. Password should be longer than 7 characters."
		}
	})

	t.deepEqual(action, {
		type: FAILED_SIGNUP,
		msg: {
			username: "testuser is already in use",
			email: "your@email.com has been signed up. Do you want to find password?",
			password: "Password is too short. Password should be longer than 7 characters."
		}
	}, msg)
}