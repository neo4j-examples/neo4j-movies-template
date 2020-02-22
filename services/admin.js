"use strict"

var uuid = require('node-uuid');
var randomstring = require("randomstring");
var _ = require('lodash');
var dbUtils = require('../neo4j/dbUtils');
var Interest = require('../models/neo4j/interest');
var User = require('../models/neo4j/user');
var crypto = require('crypto');

var deleteData = function (session, interestData, userData) {
    return session.run(
    {

    }).then(results =>{
        throw{DELETED: 'Everything has been deleted.', status: 201}
    });
}

module.exports = {
    deleteData: deleteData,
    // connectUserToInterest: connectUserToInterest,
  // me: me,
};