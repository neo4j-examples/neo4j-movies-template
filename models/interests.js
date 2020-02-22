"use strict"

var uuid = require('node-uuid');
var randomstring = require("randomstring");
var _ = require('lodash');
var dbUtils = require('../neo4j/dbUtils');
var Interest = require('../models/neo4j/interest');
var crypto = require('crypto');

var addInterest = function (session, interestData, userData) {
    // CHECK TO SEE IF THE USER EXISTS
    return session.run('MATCH (u:User{username: {username} }) return u',
    {
        username: userData.username,
    }).then(userResults =>{
        if(_.isEmpty(userResults.records)){
            // Return a message saying the user they tried to use has not been registered
            throw {Username: 'This user has not been registered.', status: 400}
        }
        else{
        // CHECK TO SEE IF THE INTERST IS ALREADY CREATED
            return session.run('MATCH (interest:Interest {interestname: {interestname}}) RETURN interest', {interestname: interestData.interestname})
            .then(results => {
                if (!_.isEmpty(results.records)) {
                    //  IF THE INTEREST IS ALREADY CREATED, TRY TO ADD THE USER TO IT!
                    return session.run('MATCH (u:User{username: {username} }) MATCH (i:Interest {interestname: {interestname} }) MERGE (u)-[:INTERESTED_IN]->(i)',
                    {
                        username: userData.username,
                        interestname: interestData.interestname,
                    }).then(otherResults =>{    
                        // Return a message saying we added the user to the existing interest
                        throw {Message: 'This interest already exists, so we just added the user to it. No duplicates were created', status: 201}
                        }            
                    );
                    }
                else {
                // IF THE INTEREST HAS NOT BEEN CREATED, CREATE IT! 
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
                        // NOW THAT THE INTEREST HAS BEEN CREATED, ADD THE USER TO IT!
                        return session.run('MATCH (u:User{username: {username} }) MATCH (i:Interest {interestname: {interestname} }) MERGE (u)-[:INTERESTED_IN]->(i)',
                    {
                        username: userData.username,
                        interestname: interestData.interestname,
                    }).then(otherResults =>{
                            return new Interest(results.records[0].get('interest')) // Return the ID of the newly created interest
                        });
                    });
                }
            });
        }
    });
}

var getUsersInterestedIn = function (session, interestData){
    return session.run('MATCH (u:User)-[r:INTERESTED_IN]->(i:Interest {interestname: {interestname} }) RETURN u',
    {
        interestname: interestData.interestname,
    }).then(results =>{
        console.log(results);
    });
    // MATCH (u:User)-[r:INTERESTED_IN]->(i:Interest{interestname: 'skiing'}) RETURN u
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
    getUsersInterestedIn: getUsersInterestedIn,
    // connectUserToInterest: connectUserToInterest,
  // me: me,
};