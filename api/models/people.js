var _ = require('lodash');
var Person = require('../models/neo4j/person');

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
function _manyPeople(neo4jResult) {
  return neo4jResult.records.map(r => new Person(r.get('person')))
}

// get a single person by id
var getById = function (session, id) {
  var query = [
    'MATCH (person:Person {id:{id}})',
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

  return session
    .run(query, {id: parseInt(id)})
    .then(result => {
      if (!_.isEmpty(result.records)) {
        return _singlePersonWithDetails(result.records[0]);
      }
      else {
        throw {message: 'person not found', status: 404}
      }
    });
};

// get all people
var getAll = function (session) {
  return session.run('MATCH (person:Person) RETURN person')
    .then(result => _manyPeople(result));
};

// get people in Bacon path, return many persons 
var getBaconPeople = function (session, name1, name2) {
//needs to be optimized
  var query = [
    'MATCH p = shortestPath( (p1:Person {name:{name1} })-[:ACTED_IN*]-(target:Person {name:{name2} }) )',
    'WITH extract(n in nodes(p)|n) AS coll',
    'WITH filter(thing in coll where length(thing.name)> 0) AS bacon',
    'UNWIND(bacon) AS person',
    'RETURN DISTINCT person'
  ].join('\n');

  return session.run(query, {
    name1: name1,
    name2: name2
  }).then(result => _manyPeople(result))
};

module.exports = {
  getAll: getAll,
  getById: getById,
  getBaconPeople: getBaconPeople
};
