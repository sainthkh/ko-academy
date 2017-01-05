import * as express from 'express'
import { Subscriber } from '../common/data'
import { sendAutoresponder, addMember } from './email'

const router = express.Router()

router.post('/subscribe', (req, res) => {
	let emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
	const { email, first_name } = req.body
	if(emailFormat.test(email)) {
		Subscriber.then(db => {
			db.count({where: {email: email}})
			.then(count => {
				if(count == 0) {
					db.create({
						email,
						first_name,
					})
				}
				//ToDo: 'beginning-hangeul' should be slug from the app(req.body.slug).
				sendAutoresponder('beginning-hangeul', email, first_name)
				addMember('beginning-hangeul', email, first_name)
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