const _ = require('lodash');
const Person = require('../models/neo4j/person');

const _singlePersonWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new Person(record.get('person')));
    // mappings are temporary until the neo4j driver team decides what to do about numbers
    result.directed = _.map(record.get('directed'), record => {
      return record;
    });
    result.produced = _.map(record.get('produced'), record => {
      return record;
    });
    result.wrote = _.map(record.get('wrote'), record => {
      return record;
    });
    result.actedIn = _.map(record.get('actedIn'), record => {
      return record;
    });
    result.related = _.map(record.get('related'), record => {
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
const getById = function (session, id) {
  const query = [
    'MATCH (person:Person {tmdbId: $id})',
    'OPTIONAL MATCH (person)-[:DIRECTED]->(d:Movie)',
    'OPTIONAL MATCH (person)<-[:PRODUCED]->(p:Movie)',
    'OPTIONAL MATCH (person)<-[:WRITER_OF]->(w:Movie)',
    'OPTIONAL MATCH (person)<-[r:ACTED_IN]->(a:Movie)',
    'OPTIONAL MATCH (person)-->(movies)<-[relatedRole:ACTED_IN]-(relatedPerson)',
    'RETURN DISTINCT person,',
    'collect(DISTINCT { name:d.title, id:d.tmdbId, poster_image:d.poster}) AS directed,',
    'collect(DISTINCT { name:p.title, id:p.tmdbId, poster_image:p.poster}) AS produced,',
    'collect(DISTINCT { name:w.title, id:w.tmdbId, poster_image:w.poster}) AS wrote,',
    'collect(DISTINCT{ name:a.title, id:a.tmdbId, poster_image:a.poster, role:r.role}) AS actedIn,',
    'collect(DISTINCT{ name:relatedPerson.name, id:relatedPerson.tmdbId, poster_image:relatedPerson.poster, role:relatedRole.role}) AS related'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {id: id})
    ).then(result => {
      if (!_.isEmpty(result.records)) {
        return _singlePersonWithDetails(result.records[0]);
      }
      else {
        throw {message: 'person not found', status: 404}
      }
    });
};

// get all people
const getAll = function (session) {
  return session.readTransaction(txc =>
      txc.run('MATCH (person:Person) RETURN person')
    ).then(result => _manyPeople(result));
};

// get people in Bacon path, return many persons 
const getBaconPeople = function (session, name1, name2) {
//needs to be optimized
  const query = [
    'MATCH p = shortestPath( (p1:Person {name: $name1 })-[:ACTED_IN*]-(target:Person {name: $name2 }) )',
    'WITH [n IN nodes(p) WHERE n:Person | n] as bacon',
    'UNWIND(bacon) AS person',
    'RETURN DISTINCT person'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        name1: name1,
        name2: name2
      })
    ).then(result => _manyPeople(result))
};

module.exports = {
  getAll: getAll,
  getById: getById,
  getBaconPeople: getBaconPeople
};
