import * as express from 'express'
import { handleGetRequest } from '../common/request'
import { Lecture } from '../common/data'

const router = express.Router()

handleGetRequest({
	router, 
	Model: Lecture, 
	path: '/',
	arg: "slug",
})

export default router