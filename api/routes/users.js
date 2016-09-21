// movies.js
var Users = require('../models/users')
  , writeResponse = require('../helpers/writeResponse')
  , loginRequired = require('../middlewares/loginRequired')
  , dbUtils = require('../neo4j/dbUtils')
  , sw = require("swagger-node-express")
  , param = sw.params
  , url = require('url')
  , swe = sw.errors
  , error = sw.error
  , _ = require('lodash');

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
      param.body('body', 'register body', 'UserRegister')],
    "responseClass": "UserResponse",
    "errorResponses": [{"code": 400, "reason": "Error message(s)"}],
    "nickname": "register"
  },
  'action': function (req, res) {
    var username = _.get(req.body, 'username');
    var password = _.get(req.body, 'password');

    if (!username) {
      return writeResponse(res, {username: 'This field is required.'}, 400);
    }
    if (!password) {
      return writeResponse(res, {password: 'This field is required.'}, 400);
    }

    Users.register(dbUtils.getSession(req), username, password)
      .then(response => writeResponse(res, response, 201))
      .catch(err => writeResponse(res, err, 400));
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
      param.body('body', 'login body', 'LoginRequest')],
    "responseClass": "LoginResponse",
    "errorResponses": [{"code": 400, "reason": "invalid credentials"}],
    "nickname": "login"
  },
  'action': function (req, res) {
    var username = _.get(req.body, 'username');
    var password = _.get(req.body, 'password');

    if (!username) {
      return writeResponse(res, {username: 'This field is required.'}, 400);
    }
    if (!password) {
      return writeResponse(res, {password: 'This field is required.'}, 400);
    }

    Users.login(dbUtils.getSession(req),username, password)
      .then(response => writeResponse(res, response))
      .catch(err => writeResponse(res, err, 400));
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
    "responseClass": "UserResponse",
    "errorResponses": [{"code": 401, "reason": "invalid / missing authentication"}],
    "nickname": "me"
  },
  'action': function (req, res) {
    loginRequired(req, res, () => {
      var authHeader = req.headers['authorization'];
      var match = authHeader.match(/^Token (\S+)/);
      if (!match || !match[1]) {
        return writeResponse(res, {detail: 'invalid authorization format. Follow `Token <token>`'}, 401);
      }

      var token = match[1];
      Users.me(dbUtils.getSession(req), token)
        .then(response => writeResponse(res, response))
        .catch(err => writeResponse(res, err, 401));
    })
  }
};
