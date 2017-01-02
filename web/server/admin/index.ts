import * as express from 'express'
import * as bodyParser from 'body-parser'

var router = express.Router()

router.use(bodyParser.json())

export default router