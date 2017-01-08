import * as express from 'express'
import { 
	Broadcast, Autoresponder, 
} from '../common/data'
import { handleRequest } from '../common/request'
import { sendmail } from '../common/email'

const router = express.Router()

handleRequest({
	router, 
	Model: Broadcast,
	path: '/broadcast',
	onPostSuccess: result => {
		const { list, title, content } = result
		sendmail(list, title, content)
	}
})

handleRequest({
	router, 
	Model: Autoresponder, 
	path: '/autoresponder',
})

export default router