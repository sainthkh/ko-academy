import * as express from 'express'
import {
	Course, CourseRecord, upsert
} from '../common/data'

const router = express.Router()

router.post('/', (req, res) => {
	Course.then(db => {
		return upsert(db, req.body)
	}).then((result:CourseRecord) => {
		res.json({
			success: true,
		})
	})
})

router.get('/', (req, res) => {
	const ID = req.query.id
	Course.then(db => {
		return db.find({ where: { ID }})
	})
	.then((result:CourseRecord) => {
		const { ID, slug, title, description, content} = result
		res.json({
			success: true,
			content: {
				ID,
				slug,
				title, 
				description,
				content,
			},
		})
	})
})

export default router