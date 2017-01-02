'use strict';
import * as express from 'express'
import * as path from 'path'

import AppRenderer from './render/app'
import AdminRenderer from './render/admin'
import { default as api } from './app'
import { default as admin } from './admin'

const app = express();
if (app.get('env') === 'development') {
	app.use(express.static(path.join(__dirname, '..', 'static')))
}

app.use('/api', api)
app.use('/admin/api', admin)
app.use('/admin', AdminRenderer)
app.use('/', AppRenderer)

export default app