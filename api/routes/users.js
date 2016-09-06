// movies.js
var Users = require('../models/users');
var sw = require("swagger-node-express");
var param = sw.params;

var url = require("url");
var swe = sw.errors;
var error = sw.error;
var _ = require('underscore');
var _l = require('lodash');

/*
 *  Util Functions
 */

function writeResponse(res, response, status) {
  sw.setHeaders(res);
  res.status(status || 200).send(JSON.stringify(response));
}

/*
 * API Specs and Functions
 */

exports.registerUser = {
  'spec': {
    "description": "Register a new user",
    "path": "/register",
    "notes": "Register a new user",
    "summary": "Register a new user",
    "method": "POST",
    "params": [
      param.body('body', 'register body', 'object')],
    "responseClass": "User",
    "nickname": "register"
  },
  'action': function (req, res) {
    var username = _l.get(req.body, 'username');
    var password = _l.get(req.body, 'password');

    if (!username) {
      return writeResponse(res, {username: 'This field is required.'}, 400);
    }
    if (!password) {
      return writeResponse(res, {password: 'This field is required.'}, 400);
    }

    Users.register(username, password)
      .then(response => {
        writeResponse(res, response, 201);
      })
      .catch(err => {
        writeResponse(res, err, 400);
      });
  }
};

exports.login = {
  'spec': {
    "description": "Login user",
    "path": "/login",
    "notes": "Login user",
    "summary": "Login user",
    "method": "POST",
    "params": [
      param.body('body', 'register body', 'object')],
    "responseClass": "User",
    "nickname": "login"
  },
  'action': function (req, res) {
    var username = _l.get(req.body, 'username');
    var password = _l.get(req.body, 'password');

    if (!username) {
      return writeResponse(res, {username: 'This field is required.'}, 400);
    }
    if (!password) {
      return writeResponse(res, {password: 'This field is required.'}, 400);
    }

    Users.login(username, password)
      .then(response => {
        writeResponse(res, response);
      })
      .catch(err => {
        writeResponse(res, err, 400);
      });
  }
};

exports.userMe = {
  'spec': {
    "description": "Get my profile",
    "path": "/users/me",
    "notes": "Get my profile",
    "summary": "Get my profile",
    "method": "GET",
    "params": [
      param.header('Authorization', 'Authorization token', 'string', true)],
    "responseClass": "User",
    "nickname": "me"
  },
  'action': function (req, res) {
    var authHeader = req.headers['authorization'];
    if (!authHeader) {
      return writeResponse(res, {detail: 'no authorization provided'}, 400);
    }

    var match = authHeader.match(/^Token (\S+)/);
    if (!match || !match[1]) {
      return writeResponse(res, {detail: 'invalid authorization format. Follow `Token <token>`'}, 400);
    }

    var token = match[1];
    Users.me(token)
      .then(response => {
        writeResponse(res, response);
      })
      .catch(err => {
        writeResponse(res, err, 400);
      });
  }
};
