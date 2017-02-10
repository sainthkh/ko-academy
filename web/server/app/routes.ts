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
			data.script = compileContent(data.script)
			resolve(data)
		})
	},
})

handleGetRequest({
	router, 
	Model: Course, 
	path: '/course',
	modifyContent: data => {
		return new Promise((resolve, reject) => {
			data.description = compileContent(data.description)
			resolve(data)
		})
	}
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
					values.question = compileContent(values.question)
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

function compileContent(content) {
	return marked(shortcode.parse(content))
}

shortcode.add('image', (text, opts) => {
	return `<img src="/uploads/${text}" alt="${opts.alt || ''}" />`
})

shortcode.add('audio', (text, opts) => {
	return `<audio controls ${opts.loop && "loop"} ${opts.autoplay && "autoplay"}><source src="/uploads/${text}"></audio>`
})

export default router