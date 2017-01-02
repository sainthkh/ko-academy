import * as express from 'express'
import * as bodyParser from 'body-parser'

import { default as auth } from './auth'

var router = express.Router()

router.use(bodyParser.json())
router.use('/auth', auth)

export default router