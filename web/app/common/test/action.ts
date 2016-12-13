const test = require('tape')
require('tape-for-immutable')

import { 
	openDialog, closeDialog, toggleDialog,
	OPEN_DIALOG, CLOSE_DIALOG,  
} from '../action'

test("openDialog when even opened", t => {
	let action = openDialog({
		open: true
	})

	t.deepEqual(action, {
		type: OPEN_DIALOG
	}, "should open")

	t.end()
})

test("closeDialog when even closed", t => {
	let action = closeDialog({
		open: false
	})

	t.deepEqual(action, {
		type: CLOSE_DIALOG
	}, "should close")

	t.end()
})

test("toggleDialog when open", t => {
	let action = toggleDialog({
		open: true
	})

	t.deepEqual(action, {
		type: CLOSE_DIALOG
	}, "should close")

	t.end()
})

test("toggleDialog when closed", t => {
	let action = toggleDialog({
		open: false
	})

	t.deepEqual(action, {
		type: OPEN_DIALOG
	}, "should open")

	t.end()
})
