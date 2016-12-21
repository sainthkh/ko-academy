const test = require('tape')
import {
	isCommonPassword 
} from '../password'

test("isCommonPassword integrated test", t => {
	t.equal(isCommonPassword('baseball'), true)
	t.end()
})