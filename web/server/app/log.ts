import * as express from 'express'
import * as jwt from 'jsonwebtoken'

import * as fs from 'fs'
import * as path from 'path'

import { User, QuestionLog } from '../common/data'



const router = express.Router()

router.post('/quiz', (req, res) => {
	var auth = req.get("authorization");
	if (auth) {
		var token = new Buffer(auth.split(" ").pop(), "base64").toString("ascii")
		var config = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json')).toString())

		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) {
				res.json({
					success: false,
				})
			} else {
				let email = decoded.email
				User.then(db => {
					return db.find({ where: { email }})
				})
				.then((result:any) => {
					const { questionID, answers } = req.body
					QuestionLog.then(db => {
						answers.forEach(a => {
							db.create({
								userID: result.ID,
								questionID,
								answerChoice: a,
								date: new Date() 
							})
						})
					})
				})
				.then(() => {
					res.json({
						success: true,
					})
				})
			}
		})
	}
})

export default router
