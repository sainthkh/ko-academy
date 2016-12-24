import { User, LoginLog } from '../data'
const sodium = require('sodium').api

export function init(server) {
	server.post('/check-duplicate', checkDuplicate)
	server.post('/create-user', createUser)
}

export function checkDuplicate(req, res, next) {
	User().then(user => {
		user.count({ where: {email: req.params.email}}).then(count => {
			if (count != 0) {
				res.send(200, {
					duplicate: true,
				})
			} else {
				res.send(200, {
					duplicate: false,
				})
			}
		})
	})
}

export function createUser(req, res, next) {
	User().then(user => {
		return user.create({
			username: req.params.username,
			email: req.params.email,
			password: sodium.crypto_pwhash_str(
				Buffer.from(req.params.password, 'utf8'),
				sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
				sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
			),
			accessLevel: "free",
			signupDate: new Date(),
			lastLogin: new Date(),
		})
	})
	.then(result => {
		res.send(200, {
			success: true
		})
	})
	.catch(err => {
		res.send(500, {
			success: false
		})
	})
}