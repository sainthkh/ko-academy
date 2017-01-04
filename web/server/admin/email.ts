import * as express from 'express'
import { Broadcast, BroadcastRecord } from '../common/data'
import { sendmail } from '../common/email'

const router = express.Router()

router.post('/broadcast', (req, res) => {
	const { list, title, content } = req.body
	Broadcast.then(db => {
		return db.create({
			to: list,
			time: new Date(),
			title: title,
			content: content,
		})
		.then((result: BroadcastRecord) => {
			sendmail(list, title, content)
			res.json({
				success: true,
				ID: result.ID,
			})
		})
	})
})

export default router