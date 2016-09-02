"use strict"

var uuid = require('node-uuid');
var randomstring = require("randomstring");
var _ = require('lodash');
var dbUtils = require('../neo4j/dbUtils');
var User = require('../models/neo4j/user');

var register = function (username, password) {
  var session = dbUtils.getSession();

  return session.run('MATCH (user:User {username: {username}}) RETURN user', {username: username})
    .then(results => {
      if (!_.isEmpty(results.records)) {
        throw {username: 'username already in use'}
      }
      else {
        return session.run('CREATE (user:User {id: {id}, username: {username}, password: {password}, api_key: {api_key}}) RETURN user',
          {
            id: uuid.v4(),
            username: username,
            password: password,
            api_key: randomstring.generate({
              length: 20,
              charset: 'hex'
            })
          }
        ).then(results => {
            session.close();
            return new User(results.records[0].get('user'));
          }
        )
      }
    })
    .catch(err => {
      session.close();
      throw err;
    });
};

var me = function (apiKey) {
  var session = dbUtils.getSession();

  return session.run('MATCH (user:User {api_key: {api_key}}) RETURN user', {api_key: apiKey})
    .then(results => {
      session.close();
      if (_.isEmpty(results.records)) {
        throw {detail: 'invalid authorization key'};
      }
      return new User(results.records[0].get('user'));
    })
    .catch(err => {
      session.close();
      throw err;
    });
};

var login = function (username, password) {
  var session = dbUtils.getSession();
  return session.run('MATCH (user:User {username: {username}}) RETURN user', {username: username})
    .then(results => {
        session.close();
        if (_.isEmpty(results.records)) {
          throw {username: 'username does not exist'}
        }
        else {
          var dbUser = _.get(results.records[0].get('user'), 'properties');
          if(_.get(dbUser, 'password') != password) {
            throw {password: 'wrong password'}
          }
          return {token: _.get(dbUser, 'api_key')};
        }
      }
    )
    .catch(err => {
      session.close();
      throw err;
    });
};

module.exports = {
  register: register,
  me: me,
  login: login
};