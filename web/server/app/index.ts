import * as express from 'express'
import * as bodyParser from 'body-parser'

import {default as auth} from './auth'
import routes from './routes'

var router = express.Router()

router.use(bodyParser.json())
router.use('/', auth)
router.use('/', routes)

export default router