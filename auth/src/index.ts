'use strict';

import * as restify from 'restify'
import * as _ from 'lodash'
import * as auth from './auth'
import * as data from './data'

const server = restify.createServer({
	name: "WiseInit-Academy-Auth-Service",
	version: "0.0.1"
});

server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser({
	mapParams: true
}));

server.on('uncaughtException', (req, res, route, err) => {
	console.log(err)
})

data.init(server)
auth.init(server)

export default server;