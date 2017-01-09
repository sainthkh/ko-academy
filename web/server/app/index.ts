import * as express from 'express'
import * as bodyParser from 'body-parser'

import {default as auth} from './auth'
import course from './course'
import lecture from './lecture'

var router = express.Router()

router.use(bodyParser.json())
router.use('/', auth)
router.use('/course', course)
router.use('/lecture', lecture)

export default router