import * as async from 'async'
import * as _ from 'lodash'
import { isCommonPassword } from './password'

export function init(server) {
	server.post('/signup', signup)
}

export const INVALID_EMAIL = "INVALID_EMAIL"
export const LONG_USERNAME = "LONG_USERNAME"
export const DUPLICATE_EMAIL = "DUPLICATE_EMAIL"
export const SHORT_PASSWORD = "SHORT_PASSWORD"
export const COMMON_PASSWORD = "COMMON_PASSWORD"

export function signup(req, res, next) {
	async.parallel([
		done => {
			if(req.params.username.length <= 50) {
				done()
			} else {
				done(null, LONG_USERNAME)
			}
		},
		// Check email
		done => {
			let emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
			if(emailFormat.test(req.params.email)) {
				done()
			} else {
				done(null, INVALID_EMAIL)
			}
		},
		// Check password
		done => {
			if(req.params.password.length >= 8) {
				if(!isCommonPassword(req.params.password)) {
					done()
				} else {
					done(null, COMMON_PASSWORD)
				}
			} else {
				done(null, SHORT_PASSWORD)
			}
		}
	],
	(err, results) => {
		_.pull(results, undefined)
		if(results.length == 0) {
			res.send({
				success: true
			})
		} else {
			res.send({
				success: false,
				error: results
			})
		}
		next(false)
	})
}

