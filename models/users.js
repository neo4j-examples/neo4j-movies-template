"use strict"

var uuid = require('node-uuid');
var randomstring = require("randomstring");
var _ = require('lodash');
var dbUtils = require('../neo4j/dbUtils');
var User = require('../models/neo4j/user');
var crypto = require('crypto');

var register = function (session, userData) {
  return session.run('MATCH (user:User {username: {username}}) RETURN user', {username: userData.username})
    .then(results => {
      if (!_.isEmpty(results.records)) {
        throw {username: 'username already in use', status: 400}
      } else {
        return session.run('CREATE (user:User {id: {id}, username: {username}, firstName: {firstName}, lastName: {lastName}, api_key: {api_key}}) RETURN user',
          {
            id: uuid.v4(),
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
          }
        ).then(results => {
            console.log(results);
            return new User(results.records[0].get('user'));
          }
        )
      }
    });
};

var registerBulk = function (session, users) {
  return Promise.all(users.map(user => session.run(
    `CREATE (user:User {id: '${uuid.v4()}', username: '${user.username}', firstName: '${user.first_name}', lastName: '${user.last_name}'}) RETURN user`
  ).then(res => new User(res.records[0].get('user')))))
  .then(function(values) {
    return values;
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
  register,
  registerBulk,
  // me: me,
};