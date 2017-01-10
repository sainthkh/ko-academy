import * as express from 'express'
import * as jwt from 'jsonwebtoken'
var sodium = require('sodium').api

import * as fs from 'fs'
import * as path from 'path'

const router = express.Router()

router.post('/login', (req, res) => {
	var config = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json')).toString())
	config.password = Buffer.from(config.password, 'base64')

	if (req.body.id == config.id && 
		sodium.crypto_pwhash_str_verify(config.password, Buffer.from(req.body.password, 'utf8'))) {
		var token = jwt.sign({ id: config.id}, config.secret, {
			expiresIn: "3d"
        });
		res.json({
			success: true,
			token: token,
		})
	} else {
		res.json({
			success: false,
		})
	}
})

export default router