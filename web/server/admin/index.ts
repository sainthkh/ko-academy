import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as jwt from 'jsonwebtoken'

import * as fs from 'fs'
import * as path from 'path'

import { default as auth } from './auth'

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

export default router