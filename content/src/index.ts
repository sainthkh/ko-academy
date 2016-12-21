'use strict';

import * as restify from 'restify'
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
    req.params = JSON.parse(req.body)
    next()
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