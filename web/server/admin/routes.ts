import * as express from 'express'
import { handleRequest } from '../common/request'
import { Course, Lecture, Broadcast, Autoresponder, Quiz, Question, } from '../common/data'
import { sendmail } from '../common/email'

const router = express.Router()

handleRequest({
	router, 
	Model: Course, 
	path: '/course'
})

handleRequest({
	router, 
	Model: Lecture, 
	path: '/lecture'
})

handleRequest({
	router, 
	Model: Broadcast,
	path: '/email/broadcast',
	onPostSuccess: result => {
		const { list, title, content } = result
		sendmail(list, title, content)
	}
})

handleRequest({
	router, 
	Model: Autoresponder, 
	path: '/email/autoresponder',
})

handleRequest({
	router, 
	Model: Quiz, 
	path: '/quiz'
})

handleRequest({
	router, 
	Model: Question, 
	path: '/question'
})

export default router