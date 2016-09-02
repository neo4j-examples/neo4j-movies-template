/**
 *  neo4j movie functions
 *  these are mostly written in a functional style
 */

var _ = require('underscore');
var uuid = require('hat'); // generates uuids
var Cypher = require('../neo4j/cypher');
var Movie = require('../models/neo4j/movie');
var Person = require('../models/neo4j/person');
var Genre = require('../models/neo4j/genre');
var randomName = require('random-name');

/*
 *  Utility Functions
 */

function _randomName() {
  return randomName.first() + ' ' + randomName.last();
}

function _randomNames(n) {
  return _.times(n, _randomName);
}

/**
 *  Result Functions
 */

// return many movies without extended details
var _manyMovies = function (record) {
  return new Movie(record.get('movie'));
};

//TODO - handle Integers - process single *extended* movie 
var _singleMovieWithDetails = function (record) {
  if (record.length) {
    var result = {};
    _.extend(result, new Movie(record.get('movie')));
    result.directors = _.map(record.get('directors'), record => {
      return new Person(record);
    });
    result.genres = _.map(record.get('genres'), record => {
      return new Genre(record);
    });
    result.producers = _.map(record.get('producers'), record => {
      return new Person(record);
    });
    result.writers = _.map(record.get('writers'), record => {
      return new Person(record);
    });
    result.actors = _.map(record.get('actors'), record => {
      if (record.id >= 0) {
        record.id = record.id.toNumber();
      }
      return record;
    });
    result.related = _.map(record.get('related'), record => {
      return new Movie(record);
    });
    result.keywords = record.get('keywords');

    return result;
  } else {
    return null;
  }
};

/**
 *  Query Functions
 */

var _matchBy = function (keys, params, options, callback) {
  var cypher_params = _.pick(params, keys);

  var query = [
    'MATCH (movie:Movie)',
    Cypher.where('movie', keys),
    'RETURN movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

// Find movie by ID and return extended movie details
var _matchById = function (params, options, callback) {
  var cypher_params = {
    n: parseInt(params.id)
  };

  var query = [
    'MATCH (movie:Movie {id:{n}})',
    'MATCH (movie)<-[r:ACTED_IN]-(a:Person) // movies must have actors',
    'MATCH (related:Movie)<--(a:Person) // movies must have related movies',
    'WHERE related <> movie',
    'OPTIONAL MATCH (movie)-[:HAS_KEYWORD]->(keyword:Keyword)',
    'OPTIONAL MATCH (movie)-[:HAS_GENRE]->(genre:Genre)',
    'OPTIONAL MATCH (movie)<-[:DIRECTED]-(d:Person)',
    'OPTIONAL MATCH (movie)<-[:PRODUCED]-(p:Person)',
    'OPTIONAL MATCH (movie)<-[:WRITER_OF]-(w:Person)',
    'WITH DISTINCT movie, genre, keyword, d, p, w, a, r, related, count(related) AS countRelated',
    'ORDER BY countRelated DESC',
    'RETURN DISTINCT movie,',
    'collect(DISTINCT keyword) AS keywords, ',
    'collect(DISTINCT d) AS directors,',
    'collect(DISTINCT p) AS producers,',
    'collect(DISTINCT w) AS writers,',
    'collect(DISTINCT{ name:a.name, id:a.id, poster_image:a.poster_image, role:r.role}) AS actors,',
    'collect(DISTINCT related) AS related,',
    'collect(DISTINCT genre) AS genres',
  ].join('\n');

  callback(null, query, cypher_params);
};

// todo - add release date to database
var _getByDateRange = function (params, options, callback) {
  var cypher_params = {
    start: parseInt(params.start || 0),
    end: parseInt(params.end || 0)
  };

  var query = [
    'MATCH (movie:Movie)',
    'WHERE movie.released > {start} AND movie.released < {end}',
    'RETURN movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _getByGenre = function (params, options, callback) {
  var cypher_params = {
    n: parseInt(params.id)
  };

  var query = [
    'MATCH (movie:Movie)-[:HAS_GENRE]->(genre)',
    'WHERE genre.id = {n}',
    'RETURN movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _getByActor = function (params, options, callback) {
  var cypher_params = {
    id: parseInt(params.id)
  };

  var query = [
    'MATCH (actor:Person {id:{id}})-[:ACTED_IN]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _getByDirector = function (params, options, callback) {
  var cypher_params = {
    id: parseInt(params.id)
  };

  var query = [
    'MATCH (:Person {id:{id}})-[:DIRECTED]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _getByWriter = function (params, options, callback) {
  var cypher_params = {
    id: parseInt(params.id)
  };

  var query = [
    'MATCH (:Person {id:{id}})-[:WRITER_OF]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _matchAll = _.partial(_matchBy, []);

// exposed functions

// get a single movie by id
var getById = Cypher(_matchById, _singleMovieWithDetails, {single: true});

// Get by date range
var getByDateRange = Cypher(_getByDateRange, _manyMovies);

// Get by date range
var getByActor = Cypher(_getByActor, _manyMovies);

// get a movie by genre
var getByGenre = Cypher(_getByGenre, _manyMovies);

// get all movies
var getAll = Cypher(_matchAll, _manyMovies);

// Get many movies directed by a person
var getByDirector = Cypher(_getByDirector, _manyMovies);

// Get many movies written by a person
var getByWriter = Cypher(_getByWriter, _manyMovies);

// export exposed functions

module.exports = {
  getAll: getAll,
  getById: getById,
  getByDateRange: getByDateRange, // unused
  getByActor: getByActor,
  getByGenre: getByGenre, //unused
  getMoviesbyDirector: getByDirector,
  getMoviesByWriter: getByWriter
};