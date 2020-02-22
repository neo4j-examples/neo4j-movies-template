"use strict"

var uuid = require('node-uuid');
var randomstring = require("randomstring");
var _ = require('lodash');
var dbUtils = require('../neo4j/dbUtils');
var Interest = require('../models/neo4j/interest');
var crypto = require('crypto');

var addInterest = function (session, interestData) {
    // console.log('DB... IM TRYING TO RUN A QUERY!');
    // console.log(interestData);
  return session.run('MATCH (interest:Interest {interestname: {interestname}}) RETURN interest', {interestname: interestData.interestname})
    .then(results => {
        // console.log("DB!! Got past the results!");
      if (!_.isEmpty(results.records)) {
        throw {interestName: 'This interest already exists', status: 400}
      }
      else {
        // console.log('DB HERE FOO',interestData.interestname)
        return session.run('CREATE (interest:Interest {id: {id}, interestname: {interestname}, api_key: {api_key}}) RETURN interest',
          {
            id: uuid.v4(),
            interestname: interestData.interestname,
            api_key: randomstring.generate({
              length: 20,
              charset: 'hex'
            })
          }
        ).then(results => {
            return new Interest(results.records[0].get('interest'));
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
    addInterest: addInterest,
  // me: me,
};