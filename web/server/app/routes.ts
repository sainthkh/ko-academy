import * as express from 'express'
import * as marked from 'marked'
marked.setOptions({
	breaks: true
})

import { handleGetRequest } from '../common/request'
import { Lecture, Course } from '../common/data'

const router = express.Router()

handleGetRequest({
	router, 
	Model: Lecture, 
	path: '/lecture',
	modifyContent: data => {
		data.script = marked(data.script)
		return data
	},
})

handleGetRequest({
	router, 
	Model: Course, 
	path: '/course',
})

export default router