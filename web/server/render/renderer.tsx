'use strict';

import * as React from 'react'
import * as express from 'express'
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux'

export function renderer(name, routes, createStore, publicUrl) {
	const router = express.Router();

	router.use('*', (req, res) => {
		let IE = require('platform').parse(req.headers['user-agent']).name == 'IE'
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
				IE ? `<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.7/es5-shim.min.js"></script>` + `<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.2/es6-shim.min.js"></script>` : ``,
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
					if(publicUrl(req.originalUrl)) {
						markup = renderToString(
							<Provider store={store}>
								<RouterContext  {...renderProps}/>
							</Provider>);
					} else {
						markup = "<!--none public url-->"
					}
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