"use strict"

var uuid = require('node-uuid');
var randomstring = require("randomstring");
var _ = require('lodash');
var dbUtils = require('../neo4j/dbUtils');
var Interest = require('../models/neo4j/interest');
var crypto = require('crypto');

var addInterest = function (session, interestData, userData) {
    return session.run('MATCH (u:User{username: {username} }) return u',
    {
        username: userData.username,
    }).then(userResults =>{
        if(_.isEmpty(userResults.records)){
            throw {Username: 'This user does not exist', status: 400}
        }
        else{
        // CHECK TO SEE IF THE INTERST IS ALREADY CREATED
            return session.run('MATCH (interest:Interest {interestname: {interestname}}) RETURN interest', {interestname: interestData.interestname})
            .then(results => {
                if (!_.isEmpty(results.records)) {
                    //   IF IT IS CREATED, TRY TO ADD THE USER TO IT!
                    return session.run('MATCH (u:User{username: {username} }) MATCH (i:Interest {interestname: {interestname} }) MERGE (u)-[:INTERESTED_IN]->(i)',
                    {
                        username: userData.username,
                        interestname: interestData.interestname,
                    }).then(otherResults =>{    
                        console.log(results.records);
                        throw {Message: 'This interest already exists, so we just added the user to it. No duplicates were created', status: 201}
                        }            
                    );
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
                        return session.run('MATCH (u:User{username: {username} }) MATCH (i:Interest {interestname: {interestname} }) MERGE (u)-[:INTERESTED_IN]->(i)',
                    {
                        username: userData.username,
                        interestname: interestData.interestname,
                    }).then(otherResults =>{
                            console.log("tried adding a user to a new interest");
                            console.log(otherResults);
                            return new Interest(results.records[0].get('interest'))
                        });
                    });
                }
            });
        }
    });
}

// var connectUserToInterest = function (session, userData, interestData){
//     return session.run('MATCH (u:User{username: {username} }) MATCH (i:Interest {interestname: {interestname} }) MERGE (u)-[:INTERESTED_IN]->(i)',
//     {
//         username: userData.username,
//         interestname: interestData.interestname,
//     }).then(results =>{
//         // returning no response.
//         }
//     );
// }

// MATCH (u:User{username:'string1'})
// MATCH (i:Interest{interestname:'Basketball'})
// MERGE (u)-[:INTERESTED_IN]->(i)

module.exports = {
    addInterest: addInterest,
    // connectUserToInterest: connectUserToInterest,
  // me: me,
};