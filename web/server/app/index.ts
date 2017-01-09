import * as express from 'express'
import * as bodyParser from 'body-parser'

import {default as auth} from './auth'
import course from './course'

var router = express.Router()

router.use(bodyParser.json())
router.use('/', auth)
router.use('/course', course)

export default router