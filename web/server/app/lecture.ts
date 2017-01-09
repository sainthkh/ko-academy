import * as express from 'express'
import * as marked from 'marked'
marked.setOptions({
	breaks: true
})

import { handleGetRequest } from '../common/request'
import { Lecture } from '../common/data'

const router = express.Router()

handleGetRequest({
	router, 
	Model: Lecture, 
	path: '/',
	arg: "slug",
	modifyContent: data => {
		data.script = marked(data.script)
		return data
	},
})

export default router