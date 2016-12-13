import { Map, List } from 'immutable'

const test = require('tape')
require('tape-for-immutable')

import { 
	openDialog, closeDialog, toggleDialog,
	OPEN_DIALOG, CLOSE_DIALOG,  
} from '../action'
import { showDialog } from '../reducer'


test("showDialog with initState and empty action", t => {
	let resultState = showDialog(undefined, {})

	t.immutableEqual(resultState, Map({
		open: false
	}), "should close")

	t.end()
})

test("showDialog with initState and open action", t => {
	let resultState = showDialog(undefined, {
		type: OPEN_DIALOG
	})

	t.immutableEqual(resultState, Map({
		open: true
	}), "should open")

	t.end()
})

test("showDialog with initState and close action", t => {
	let resultState = showDialog(undefined, {
		type: CLOSE_DIALOG
	})

	t.immutableEqual(resultState, Map({
		open: false
	}), "should close")

	t.end()
})

test("showDialog with open and empty action", t => {
	let resultState = showDialog(Map({
		open: true, 
	}), {})

	t.immutableEqual(resultState, Map({
		open: true,
	}), "should be opened")

	t.end()
})

test("showDialog with open and open action", t => {
	let resultState = showDialog(Map({
		open: true, 
	}), {
		type: OPEN_DIALOG
	})

	t.immutableEqual(resultState, Map({
		open: true
	}), "should be opened")

	t.end()
})

test("showDialog with open and close action", t => {
	let resultState = showDialog(Map({
		open: true, 
	}), {
		type: CLOSE_DIALOG
	})

	t.immutableEqual(resultState, Map({
		open: false
	}), "should close")

	t.end()
})

test("showDialog with closed state and empty action", t => {
	let resultState = showDialog(Map({
		open: false,
	}), {})

	t.immutableEqual(resultState, Map({
		open: false
	}), "no change")

	t.end()
})

test("showDialog with closed state and open action", t => {
	let resultState = showDialog(Map({
		open: false,
	}), {
		type: OPEN_DIALOG
	})

	t.immutableEqual(resultState, Map({
		open: true
	}), "should open")

	t.end()
})

test("showDialog with closed state and close action", t => {
	let resultState = showDialog(Map({
		open: false,
	}), {
		type: CLOSE_DIALOG
	})

	t.immutableEqual(resultState, Map({
		open: false
	}), "should close")

	t.end()
})