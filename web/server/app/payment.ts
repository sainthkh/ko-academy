import * as express from 'express'
import * as jwt from 'jsonwebtoken'

import * as fs from 'fs'
import * as path from 'path'

const config = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json')).toString())
const Stripe = require('stripe')(config.stripe)

import { User } from '../common/data'

const router = express.Router()

router.use((req, res, next) => {
	var auth = req.get("authorization");
	if (auth) {
		var token = new Buffer(auth.split(" ").pop(), "base64").toString("ascii")

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
					if(!result.stripeID) {
						Stripe.customers.create({
							email: result.email,
							source: req.body.token,
						})
						.then(customer => {
							User.then(db => {
								db.update({	stripeID: customer.id }, {where: {ID: result.ID}})
							})
							return customer
						})
						.then(customer => {
							let user = result.dataValues
							user.stripeID = customer.id;
							(<any>req).user = user

							next()
						})
					} else {
						(<any>req).user = result.dataValues

						next()
					}
				})
			}
		})
	}
})

router.post('/subscription/:type', (req, res) => {
	let user = (<any>req).user
	Stripe.subscriptions.create({
		customer: user.stripeID,
		plan: "gold-monthly",
	}, (err, subscription) => {
		User.then(db => {
			db.update({accessLevel:"gold"}, {where: {ID:user.ID}})
		})
		res.json({
			success: true,
		})
	})
})

export default router
