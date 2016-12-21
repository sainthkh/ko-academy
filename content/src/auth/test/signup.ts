const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
require('sinon-with-promise')
const _ = require('lodash')

import {
	INVALID_EMAIL, LONG_USERNAME, DUPLICATE_EMAIL, SHORT_PASSWORD, COMMON_PASSWORD,
	signup
} from '../signup'

test("signup with long username", t => {
	let send = sinon.spy()
	callSignup({
		username: "too long name---------------------------1111--1-1-1-1--111111111",
		email: "best@gmail.com",
		password: "11111111",
	}, send, () => {
		t.deepEqual(send.firstCall.args[0], {
			success: false,
			error: [LONG_USERNAME]
		}, "should return LONG_USERNAME")
		t.end()
	})
})

test("signup with invalid email", t => {
	let send = sinon.spy()
	callSignup({
		username: "good",
		email: "wrong",
		password: "11111111",
	}, send, () => {
		t.deepEqual(send.firstCall.args[0], {
			success: false,
			error: [INVALID_EMAIL]
		}, "should return INVALID_EMAIL")
		t.end()
	})
})

test("signup with short password", t => {
	let send = sinon.spy()
	callSignup({
		username: "Happy User",
		email: "my@email.com",
		password: "7777777",
	}, send, () => {
		t.deepEqual(send.firstCall.args[0], {
			success: false,
			error: [SHORT_PASSWORD]
		}, "should return SHORT_PASSWORD")
		t.end()
	})
})

test("signup with multiple error", t => {
	let send = sinon.spy()
	callSignup({
		username: "Great Long User Name aaaaadsfawqre qeraaasdfaaa qwraaasdfaaasdf",
		email: "wrong@@email",
		password: "7777777",
	}, send, () => {
		t.equal(send.firstCall.args[0].success, false, "success should be false")
		t.ok(_.includes(send.firstCall.args[0].error, LONG_USERNAME), "should include LONG_USERNAME")
		t.ok(_.includes(send.firstCall.args[0].error, SHORT_PASSWORD), "should include SHORT_PASSWORD")
		t.ok(_.includes(send.firstCall.args[0].error, INVALID_EMAIL), "should include INVALID_EMAIL")
		t.end()
	})
})


const callSignup = (params, mock, test) => {
	let req = {
		params: params
	}

	let res = {
		send: (typeof mock === "function")? mock: mock.send
	}

	let isCommonPasswordStub = sinon.stub().returns(false)
	let m = proxyquire('../signup', {
		'./password': {
			isCommonPassword: mock.common? mock.common: isCommonPasswordStub,
		}
	})

	m.signup(req, res, test)
}