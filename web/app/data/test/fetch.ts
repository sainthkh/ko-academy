const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const sinonPromised = require('sinon-as-promised')

import {
	serverDown, pageNotFound, internalServerError, otherError,
	FETCH_SUCCESS, SERVER_DOWN, PAGE_NOT_FOUND, INTERNAL_SERVER_ERROR, OTHER_ERROR
} from '../fetch'

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

test("fetch success", t => {
	var fetchStub = sinon.stub().resolves({
		status: 200,
		json: () => ({})
	})
	var fetch = mockFetch(fetchStub)

	fetch('/success', 'user0', {a: 'test0'})
	.then(err => {
		t.equal(err.type, FETCH_SUCCESS, "Action type: fetch success")
		t.end()
	})
})

test("fetch with server down", t => {
	var fetchStub = sinon.stub().rejects({
		code: "ECONNREFUSED"
	})
	var fetch = mockFetch(fetchStub)

	fetch('/abc', 'user', {a: 'test'})
	.then(err => {
		t.equal(err.type, SERVER_DOWN, "Action type: server down")
		t.end()
	})
})

test("fetch with page not found", t => {
	var fetchStub = sinon.stub().resolves({
		status: 404,
	})
	var fetch = mockFetch(fetchStub)

	fetch('/cba', 'user2', {d: 'test-for-you'})
	.then(err => {
		t.equal(err.type, PAGE_NOT_FOUND, "Action type: page not found")
		t.end()
	})
})

test("fetch with internal server error", t => {
	var fetchStub = sinon.stub().resolves({
		status: 500,
	})
	var fetch = mockFetch(fetchStub)

	fetch('/cde', 'user3', {d: 'tes'})
	.then(err => {
		t.equal(err.type, INTERNAL_SERVER_ERROR, "Action type: internal server error")
		t.equal(err.error.username, 'user3', "Username: user3")
		t.end()
	})
})

test("fetch with other error", t => {
	var fetchStub = sinon.stub().resolves({
		status: 504,
	})
	var fetch = mockFetch(fetchStub)

	fetch('/cfe', 'user4', {d: 'tes1'})
	.then(err => {
		t.equal(err.type, OTHER_ERROR, "Action type: other error")
		t.equal(err.error.username, 'user4', "Username: user4")
		t.end()
	})
})

const mockFetch = (fetch?) => {
	var fetch = fetch ? fetch: sinon.stub().resolves({})
	var action = proxyquire('../fetch', {
		'isomorphic-fetch': fetch.promised? fetch.promised: fetch,
	})

	return action.fetch
}