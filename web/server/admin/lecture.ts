import * as express from 'express'
import { handleRequest } from '../common/request'
import { Lecture } from '../common/data'

const router = express.Router()

handleRequest({
	router, 
	Model: Lecture, 
	path: '/'
})

export default router