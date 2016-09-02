_ = require('underscore');
var Cypher = require('../neo4j/cypher');
var Genre = require('../models/neo4j/genre');


// Get all Genres

 // build the query
var _getAll = function (params, options, callback) {
  var cypher_params = {};
  var query = [
    'MATCH (genre:Genre)',
    'RETURN genre',
  ].join('\n');
  callback(null, query, cypher_params);
};

// parse the results
var _singleGenre = function (record) {
  return new Genre(record.get('genre'));
};

var getAll = Cypher(_getAll, _singleGenre);

module.exports = {
  getAll: getAll
};