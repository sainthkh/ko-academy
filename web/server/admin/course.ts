import * as express from 'express'
import {
	Course, CourseRecord,
} from '../common/data'

const router = express.Router()

router.post('/', (req, res) => {
	const { slug, title, description, content } = req.body
	Course.then(db => {
		return db.create({
			slug, 
			title, 
			description,
			content,
		})
	}).then((result:CourseRecord) => {
		res.json({
			success: true,
			slug: result.slug,
		})
	})
})

export default router