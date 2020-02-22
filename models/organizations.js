var _ = require('lodash');
var uuid = require('node-uuid');

var Organization = require('../models/neo4j/organization');

var getAll = function(session) {
  return session.run('MATCH (org:Organization) RETURN org')
    .then(_manyOrgs);
};

var create = function (session, name) {
    return session.run('CREATE (org:Organization {id: {id}, name: {name}}) RETURN org',
    {
        id: uuid.v4(),
        name: name,
    }
    ).then(results => {
        return new Organization(results.records[0].get('org'));
    })
};

var _manyOrgs = function (result) {
  return result.records.map(r => new Organization(r.get('org')));
};

module.exports = {
  getAll: getAll,
  create,
};