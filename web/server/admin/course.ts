import * as express from 'express'
import { handleRequest } from '../common/request'
import { Course } from '../common/data'

const router = express.Router()

handleRequest({
	router, 
	Model: Course, 
	path: '/'
})

export default router