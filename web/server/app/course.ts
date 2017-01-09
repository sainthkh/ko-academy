import * as express from 'express'
import { handleGetRequest } from '../common/request'
import { Course } from '../common/data'

const router = express.Router()

handleGetRequest({
	router, 
	Model: Course, 
	path: '/',
})

export default router