import * as express from 'express'
import { Broadcast, BroadcastRecord } from '../common/data'

const router = express.Router()

router.post('/broadcast', (req, res) => {
	Broadcast.then(db => {
		return db.create({
			to: req.body.list,
			time: new Date(),
			title: req.body.title,
			content: req.body.content,
		})
		.then((result: BroadcastRecord) => {
			res.json({
				success: true,
				ID: result.ID,
			})
		})
	})
})

export default router