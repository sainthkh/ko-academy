'use strict';
import * as express from 'express'
import * as path from 'path'

import { default as renderApp } from './render-app'

const app = express();
app.use(express.static(path.join(__dirname, '..', 'static')))

app.use('/', renderApp)

export default app