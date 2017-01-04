import * as express from 'express'
import { 
	Broadcast, BroadcastRecord,
	Autoresponder, AutoresponderRecord,
} from '../common/data'
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

router.post('/autoresponder', (req, res) => {
	Autoresponder.then(db => {
		return db.create({
			slug: req.body.slug,
			listName: req.body.listName,
			address: req.body.address,
			title: req.body.title,
			content: req.body.content
		})
		.then((result: AutoresponderRecord) => {
			res.json({
				success: true,
				slug: result.slug
			})
		})
		.catch(err => {
			res.json({
				success: false,
			})
		})
	})
})

export default router