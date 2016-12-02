'use strict';

const express = require('express');
const bodyparser = require('body-parser')
const path = require('path');
const exphbs = require('express-handlebars')
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

import routes from './routes';

const app = express();

app.use(express.static('static'))
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.set('port', process.env.PORT || 3000);

var hbs = exphbs.create({
  extname: '.hbs',
  layoutsDir: path.join(__dirname),
  partialsDir: path.join(__dirname)
}) 

app.engine('.hbs', hbs.engine)

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname))

app.get('*', (req, res) => {
	match(
		{ routes, location: req.url },
		(err, redirectLocation, renderProps) => {
			// in case of error display the error message
			if (err) {
				return res.status(500).send(err.message);
			}

			// in case of redirect propagate the redirect to the browser
			if (redirectLocation) {
				return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
			}

			// generate the React markup for the current route
			let markup;
			if (renderProps) {
				// if the current route matched we have renderProps
				markup = renderToString(<RouterContext {...renderProps}/>);
			} else {
				// otherwise we can render a 404 page
				markup = renderToString(<NotFoundPage/>);
				res.status(404);
			}

			// render the index template with the embedded React markup
			return res.render('layout', { markup });
		}
	);
});

module.exports = app