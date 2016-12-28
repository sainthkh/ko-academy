'use strict';
import * as express from 'express'
import * as path from 'path'

import { default as renderApp } from './render-app'
import { default as api} from './api'

const app = express();
app.use(express.static(path.join(__dirname, '..', 'static')))

app.use('/api', api)
app.use('/', renderApp)

export default app