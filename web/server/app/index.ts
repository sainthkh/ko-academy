import * as express from 'express'
import * as bodyParser from 'body-parser'

import {default as auth} from './auth'
import log from './log'
import payment from './payment'
import routes from './routes'

var router = express.Router()

router.use(bodyParser.json())
router.use('/log', log)
router.use('/payment', payment)
router.use('/', auth)
router.use('/', routes)

export default router