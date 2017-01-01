'use strict';

import * as React from 'react'
import * as express from 'express'
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux'

export function renderer(name, routes, createStore) {
	const router = express.Router();

	router.use('*', (req, res) => {
		var code = [
			`<!DOCTYPE html>`,
			`<html>`,
				`<head>`,
					`<meta charset="utf-8" />`,
					`<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
					`<title>WiseInit Academy - Step by Step to Korean Language Master</title>`,
					`<link rel="stylesheet" href="/${name}/style.css">`,
				`</head>`,
			`<body>`,
				`<div id="main">{{{markup}}}</div>`,
				`<script src="/${name}/bundle.js"></script>`,
			`</body>`,
			`</html>`,
		].join(``)

		let store = createStore() 

		match(
			{ routes, location: req.originalUrl },
			(err, redirectLocation, renderProps) => {
				// in case of error display the error message
				if (err) {
					res.writeHead(500)
					return res.end(err.message)
				}

				// in case of redirect propagate the redirect to the browser
				if (redirectLocation) {
					res.writeHead(302, {
						'Location': redirectLocation.pathname + redirectLocation.search
					})
					return res.end()
				}

				// generate the React markup for the current route
				let markup;
				if (renderProps) {
					// if the current route matched we have renderProps
					res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"})
					markup = renderToString(
						<Provider store={store}>
							<RouterContext  {...renderProps}/>
						</Provider>);
				} else {
					// otherwise we can render a 404 page
					//markup = renderToString(<NotFoundPage/>);
					res.writeHead(404, {"Content-Type": "text/html; charset=utf-8"});
				}
				
				// render the index template with the embedded React markup
				res.write(code.replace('{{{markup}}}', markup), "utf8")
				return res.end();
			}
		); 
	})

	return router
}