import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as jwt from 'jsonwebtoken'

import * as fs from 'fs'
import * as path from 'path'

import { default as auth } from './auth'
import { default as email } from './email'
import { default as course } from './course'

var router = express.Router()

router.use(bodyParser.json())
router.use('/auth', auth)
router.use((req, res, next) => {
	if(req.body.token) {
		var config = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json')).toString())

		jwt.verify(req.body.token, config.secret, (err, decoded) => {  
			if (err) {
				return res.json({
					access: false,
				})
			} else {
				(<any>req).user = decoded;
				next()
			}
		})
	} else {
		res.json({
			access: false,
		})
	}
})
router.use('/email', email)
router.use('/course', course)

export default router