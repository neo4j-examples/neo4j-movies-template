/**
 *  Person functions
 */

var _ = require('underscore');
var Cypher = require('../neo4j/cypher');
var Person = require('../models/neo4j/person');
var Movie = require('../models/neo4j/movie');

/**
 *  Result Functions
 *  to be combined with queries using _.partial()
 */

var _singlePersonWithDetails = function (record) {
  if (record.length) {
    var result = {};
    _.extend(result, new Person(record.get('person')));
    // mappings are temporary until the neo4j driver team decides what to do about numbers
    result.directed = _.map(record.get('directed'), record => {
      if (record.id) {
        record.id = record.id.toNumber();
      }
      return record;
    });
    result.produced = _.map(record.get('produced'), record => {
      if (record.id) {
        record.id = record.id.toNumber();
      }
      return record;
    });
    result.wrote = _.map(record.get('wrote'), record => {
      if (record.id) {
        record.id = record.id.toNumber();
      }
      return record;
    });
    result.actedIn = _.map(record.get('actedIn'), record => {
      if (record.id) {
        record.id = record.id.toNumber();
      }
      return record;
    });
    result.related = _.map(record.get('related'), record => {
      if (record.id) {
        record.id = record.id.toNumber();
      }
      return record;
    });
    return result;
  }
  else {
    return null;
  }
};

// return many people
var _manyPersons = function (record) {
  return new Person(record.get('person'));
};

/**
 *  Query Functions
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

var _matchById = function (params, options, callback) {
  var cypher_params = {
    n: parseInt(params.id)
  };

  var query = [
    'MATCH (person:Person {id:{n}})',
    'OPTIONAL MATCH (person)-[:DIRECTED]->(d:Movie)',
    'OPTIONAL MATCH (person)<-[:PRODUCED]->(p:Movie)',
    'OPTIONAL MATCH (person)<-[:WRITER_OF]->(w:Movie)',
    'OPTIONAL MATCH (person)<-[r:ACTED_IN]->(a:Movie)',
    'OPTIONAL MATCH (person)-->(movies)<-[relatedRole:ACTED_IN]-(relatedPerson)',
    'RETURN DISTINCT person,',
    'collect(DISTINCT { name:d.title, id:d.id, poster_image:d.poster_image}) AS directed,',
    'collect(DISTINCT { name:p.title, id:p.id, poster_image:p.poster_image}) AS produced,',
    'collect(DISTINCT { name:w.title, id:w.id, poster_image:w.poster_image}) AS wrote,',
    'collect(DISTINCT{ name:a.title, id:a.id, poster_image:a.poster_image, role:r.role}) AS actedIn,',
    'collect(DISTINCT{ name:relatedPerson.name, id:relatedPerson.id, poster_image:relatedPerson.poster_image, role:relatedRole.role}) AS related'
  ].join('\n');
  callback(null, query, cypher_params);
};

var _matchAll = _.partial(_matchBy, []);

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
    'RETURN DISTINCT person'
  ].join('\n');
  callback(null, query, cypher_params);
};

// get a single person by id
var getById = Cypher(_matchById, _singlePersonWithDetails, {single: true});

// get all people
var getAll = Cypher(_matchAll, _manyPersons);

// get people in Bacon path, return many persons 
var getBaconPeople = Cypher(_matchBacon, _manyPersons);

// export exposed functions
module.exports = {
  getAll: getAll,
  getById: getById,
  getBaconPeople: getBaconPeople
};
