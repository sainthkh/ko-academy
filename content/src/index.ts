'use strict';

import * as restify from 'restify'
import * as _ from 'lodash'
import * as auth from './auth'

const server = restify.createServer({
	name: "WiseInit-Academy-Content-Service",
	version: "0.0.1"
});

server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser({
	mapParams: true
}));
server.use((req, res, next) => {
	//simple json parser
	let allowedMethods = ['POST', 'GET', 'PUT', 'DELETE']
	if(_.includes(allowedMethods, req.method)) {
		if(req.body && typeof req.body === "string") {
			try {
				req.params = JSON.parse(req.body)
			} catch(err) {
				console.log(err)
			}
		}
	}
	next()
})
server.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5101');

	return next()
})

server.opts(/\.*/, (req, res, next) => {
	res.setHeader('Access-Control-Allow-Headers', 'authorization, Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
	res.setHeader('Access-Control-Max-Age', '1000');
	res.send(200)
	return next()
})

server.on('uncaughtException', (req, res, route, err) => {
	console.log(err)
})

auth.init(server)

// Mimic API Key authentication.

var apiKeys = [ { user: 'them', key: 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF' } ];

function check(req, res, next) {
	if (req.authorization) {
		var found = false;
		for (let auth of apiKeys) {
			if (auth.key  === req.authorization.basic.password
			 && auth.user === req.authorization.basic.username) {
				found = true;
				break;
			}
		}
		if (found) next();
		else {
			res.send(401, new Error("Not authenticated"));
			next(false);
		}
	} else {
		res.send(500, new Error('No Authorization Key'));
		next(false);
	}
}

export default server;