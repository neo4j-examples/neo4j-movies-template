var _ = require('lodash');
var Genre = require('../models/neo4j/genre');

var getAll = function(session) {
  return session.run('MATCH (genre:Genre) RETURN genre')
    .then(_manyGenres);
};

var _manyGenres = function (result) {
  return result.records.map(r => new Genre(r.get('genre')));
};

module.exports = {
  getAll: getAll
};