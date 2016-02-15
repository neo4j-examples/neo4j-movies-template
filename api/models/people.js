/**
 *  Person functions
 */

var _ = require('underscore');
var uuid = require('hat'); // generates uuids
var Cypher = require('../neo4j/cypher');
var Person = require('../models/neo4j/person');
var async = require('async');

/**
 *  Result Functions
 *  to be combined with queries using _.partial()
 */

// return a single person
var _singlePerson = function (results, callback) {
  if (results.length) {
    var person = new Person(results[0].person);
    person.movies = results[0].movie;
    person.related = results[0].related;
    callback(null, person);
  } else {
    callback(null, null);
  }
};

// return many people
var _manyPersons = function (results, callback) {
  var people = _.map(results, function (result) {
    return new Person(result.person);
  });

  callback(null, people);
};

// return a count
var _singleCount = function (results, callback) {
  if (results.length) {
    callback(null, {
      count: results[0].c || 0
    });
  } else {
    callback(null, null);
  }
};

/**
 *  Query Functions
 *  to be combined with result functions using _.partial()
 */

var _matchBy = function (keys, params, options, callback) {
  var cypher_params = _.pick(params, keys);

  var query = [
    'MATCH (person:Person)',
    Cypher.where('person', keys),
    'RETURN person'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _getCoActorsByPerson = function (params, options, callback) {
  var cypher_params = {
    id: parseInt(params.id)
  };

  var query = [
    'MATCH (actor:Person {id:{id}})',
    'MATCH (actor)-[:ACTED_IN]->(m)',
    'WITH m, actor',
    'MATCH (m)<-[:ACTED_IN]-(person:Person)',
    'WHERE actor <> person', 
    'RETURN DISTINCT person',
  ].join('\n');

  callback(null, query, cypher_params);
};

var _getViewByName = function (params, options, callback) {
  var cypher_params = {
    name: params.name
  };

  var query = [
    'MATCH (person:Person {name: {name}})',
    'MATCH (person:Person)-[relatedTo]-(movie:Movie)', 
    'OPTIONAL MATCH (person)-[:ACTED_IN]->(movies)<-[:ACTED_IN]-(people)',
    'WITH DISTINCT { name: people.name, poster_image: people.poster_image } as related, count(DISTINCT movies) as weight, movie, person',
    'ORDER BY weight DESC',
    'RETURN collect(DISTINCT { title: movie.title, poster_image: movie.poster_image }) as movie, collect(DISTINCT { related: related, weight: weight }) as related, person'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _matchByUUID = _.partial(_matchBy, parseInt(['id']));
var _matchAll = _.partial(_matchBy, []);

var _getAllCount = function (params, options, callback) {
  var cypher_params = {};

  var query = [
    'MATCH (person:Person)',
    'RETURN COUNT(person) as c'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _updateName = function (params, options, callback) {
  var cypher_params = {
    id : params.id,
    name : params.name
  };

  var query = [
    'MATCH (person:Person {id:{id}})',
    'SET person.name = {name}',
    'RETURN person'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _matchBacon = function (params, options, callback) {
  var cypher_params = {
    name1: params.name1,
    name2: params.name2
  };
  //needs to be optimized
  var query = [
    'MATCH p = shortestPath( (p1:Person {name:{name1} })-[:ACTED_IN*]-(target:Person {name:{name2} }) )',
    'WITH extract(n in nodes(p)|n) AS coll',
    'WITH filter(thing in coll where length(thing.name)> 0) AS bacon',
    'UNWIND(bacon) AS person',
    'RETURN distinct person'
  ].join('\n');
  callback(null, query, cypher_params);
};

// get a single person by id
var getById = Cypher(_matchByUUID, _singlePerson);

// get a single person by name
var getByName = Cypher(_getViewByName, _singlePerson);

// Get a coacters of a person
var getCoActorsByPerson = Cypher(_getCoActorsByPerson, _manyPersons);

// get all people
var getAll = Cypher(_matchAll, _manyPersons);

// get people in Bacon path, return many persons 
var getBaconPeople = Cypher(_matchBacon, _manyPersons);

// get all people count
var getAllCount = Cypher(_getAllCount, _singleCount);

// export exposed functions
module.exports = {
  getAll: getAll,
  getById: getById,
  getCoActorsByPerson: getCoActorsByPerson,
  getBaconPeople: getBaconPeople
};
