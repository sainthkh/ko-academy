import * as express from 'express'
import { Subscriber } from '../data'

const router = express.Router()

router.post('/subscribe', (req, res) => {
	let emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
	if(emailFormat.test(req.body.email)) {
		Subscriber.then(db => {
			db.count({where: {email: req.body.email}})
			.then(count => {
				if(count != 0) {
					db.create({
						email: req.body.email,
						first_name: req.body.first_name,
					})
				}
				res.json({
					success: true,
				})
			})
		})
	} else {
		res.json({
			success: false,
		})
	}
})

export default router