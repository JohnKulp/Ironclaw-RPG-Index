"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./app.config');
const serveStatic = require("serve-static");
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(serveStatic(path.join(__dirname, 'dist')));

// CORS middleware
const allowCrossDomain = function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', '*');
		res.header('Access-Control-Allow-Headers', '*');
		next();
}

//JWT auth middleware
const authMiddleware = function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
	// removes the first 6 characters of the authorization token if it's in the format "Token [...]"
	if(token && req.headers.authorization) token = token.substring(6);
	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) {
				return next();
			} else {
				// if everything is good, save to request for use in other routes
				req.user = decoded;
				return next();
			}
		});
	} else {
		// if there is no token
		// return an error
		return next();
	}
};

app.use(allowCrossDomain);
app.use(authMiddleware);

let routes = require('./controllers');

app.use(routes);

let port = process.env.PORT || 8082;

app.listen(port, function() {
		console.log('Express server listening on port ' + port)
});