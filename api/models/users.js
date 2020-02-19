"use strict"

var uuid = require('node-uuid');
var randomstring = require("randomstring");
var _ = require('lodash');
var dbUtils = require('../neo4j/dbUtils');
var User = require('../models/neo4j/user');
var crypto = require('crypto');

var register = function (session, username) {
  return session.run('MATCH (user:User {username: {username}}) RETURN user', {username: username})
    .then(results => {
      if (!_.isEmpty(results.records)) {
        throw {username: 'username already in use', status: 400}
      }
      else {
        console.log('DB HERE FOO',username)
        return session.run('CREATE (user:User {id: {id}, username: {username}, api_key: {api_key}}) RETURN user',
          {
            id: uuid.v4(),
            username: username,
            api_key: randomstring.generate({
              length: 20,
              charset: 'hex'
            })
          }
        ).then(results => {
            return new User(results.records[0].get('user'));
          }
        )
      }
    });
};

// var me = function (session, apiKey) {
//   return session.run('MATCH (user:User {api_key: {api_key}}) RETURN user', {api_key: apiKey})
//     .then(results => {
//       if (_.isEmpty(results.records)) {
//         throw {message: 'invalid authorization key', status: 401};
//       }
//       return new User(results.records[0].get('user'));
//     });
// };

module.exports = {
  register: register,
  // me: me,
};