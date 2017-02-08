import * as express from 'express'
import * as marked from 'marked'
marked.setOptions({
	breaks: true
})
import * as shortcode from 'shortcode-parser'

import { handleGetRequest } from '../common/request'
import { Lecture, Course, Quiz, Question } from '../common/data'

const router = express.Router()

handleGetRequest({
	router, 
	Model: Lecture, 
	path: '/lecture',
	modifyContent: data => {
		return new Promise((resolve, reject) => {
			data.script = marked(data.script)
			resolve(data)
		})
	},
})

handleGetRequest({
	router, 
	Model: Course, 
	path: '/course',
})

handleGetRequest({
	router,
	Model: Quiz,
	path: '/quiz',
	modifyContent: data => {
		return new Promise((resolve, reject) => {
			let IDs = data.questionIDs.split(',').map(ID => {
				return ID.trim()
			})

			Question.then(db => {
				return db.all({where: {ID: IDs}})
			})
			.then((results: any[]) => {
				let questions = results.map(result => {
					let values = result.dataValues
					values.question = marked(shortcode.parse(values.question))
					delete values.createdAt
					delete values.updatedAt
					return values
				})

				data.questions = questions
				resolve(data)
			})
		})
	}
})

export default router