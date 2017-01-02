const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const sinonPromised = require('sinon-as-promised')

import {
	requestLogin, receivedLogin,
	REQUEST_LOGIN, SUCCEEDED_LOGIN, FAILED_LOGIN,
} from '../action'

test("requestLogin in any condition", t => {
	let action = requestLogin({
		email: "test-user@naver.com",
		password: "test-value"
	})

	t.deepEqual(action, {
		type: REQUEST_LOGIN,
	}, "returns correct type")

	t.end()
})

test("receivedLogin when succeeded login", t => {
	let action = receivedLogin({
		success: true,
		username: "tiger",
		token: "random token",
	})

	t.deepEqual(action, {
		type: SUCCEEDED_LOGIN,
		username: "tiger",
		token: "random token",
	}, "returns correct type, username, token")

	t.end()
})

test("receivedLogin when failed login", t => {
	let action = receivedLogin({
		success: false,
	})

	t.deepEqual(action, {
		type: FAILED_LOGIN,
	}, "returns correct type, error")

	t.end()
})

test("fetchLogin with correct userdata", t => {
	testRequestedLogin(t)
	testCorrectAPICall(t)

	var email = "helloworld@good.com" 
	var token = "my token"
	var username = "hello3"
	var fetch = sinon.stub().resolves({
		success: true,
		username,
		token
	})
	var fetchLogin = mockFetchLogin(fetch)
	var thunk = fetchLogin({
		email,
		password: "unexpected-p@ss"
	})
	var dispatch = sinon.spy()
	thunk(dispatch)
	.then(() => {
		t.deepEqual(dispatch.secondCall.args[0], {
			type: SUCCEEDED_LOGIN,
			username,
			token
		}, "Correct Action: Succeeded Login")

		t.end()
	})
})

test("fetchLogin with incorrect userdata", t => {
	testRequestedLogin(t)
	testCorrectAPICall(t)

	var fetch = sinon.stub().resolves({
		success: false,
	})
	var fetchLogin = mockFetchLogin(fetch)
	var thunk = fetchLogin({
		email: "helloworld@bad.com" ,
		password: "unexpected-p@ss"
	})
	var dispatch = sinon.spy()
	thunk(dispatch)
	.then(() => {
		t.deepEqual(dispatch.secondCall.args[0], {
			type: FAILED_LOGIN,
		}, "Correct Action: Failed Login")

		t.end()
	})
})

const testRequestedLogin = t => {
	var req = {
		email: "user@yahoo.com",
		password: "secure-word",
	}
	var fetchLogin = mockFetchLogin()
	var thunk = fetchLogin(req)
	var dispatch = sinon.spy()
	thunk(dispatch)
	.then(() => {
		t.equal(dispatch.firstCall.args[0].type, REQUEST_LOGIN, "requested login")
	})

}

const testCorrectAPICall = t => {
	var req = {
		email: "happy@yahoo.com",
		password: "secure-pw",
	}
	var fetch = sinon.spy().resolves({
		status: 200,
		json: () => ({})
	})
	var fetchLogin = mockFetchLogin(fetch)
	var thunk = fetchLogin(req)
	var dispatch = sinon.stub()
	thunk(dispatch)
	.then(() => {
		t.equal(fetch.firstCall.args[0], '/login', "correct API path")
		t.equal(fetch.callCount, 1, "fetch should be called only once")
		t.equal(fetch.firstCall.args[1], "guest", "not logged in yet. So, it should be guest")
		t.deepEqual(fetch.firstCall.args[2].args, req, "request should be relayed")
	})
}

function mockFetchLogin(fetch?) {
	var fetch = fetch ? fetch: sinon.stub().resolves({})
	var action = proxyquire('../action', {
		'../../data/fetch': {
			fetch: fetch.promised? fetch.promised: fetch,
		}
	})

	return action.fetchLogin
}
