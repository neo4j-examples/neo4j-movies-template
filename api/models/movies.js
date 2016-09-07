/**
 *  neo4j movie functions
 *  these are mostly written in a functional style
 */

var _ = require('underscore');
var uuid = require('hat'); // generates uuids
var Cypher = require('../neo4j/cypher');
var dbUtils = require('../neo4j/dbUtils');
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
    _.extend(result, new Movie(record.get('movie'), record.get('my_rating')));

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
    id: parseInt(params.id),
    userId: params.userId
  };

  var query = [
    'MATCH (movie:Movie {id: {id}})',
    'OPTIONAL MATCH (movie)<-[my_rated:RATED]-(me:User {id: {userId}})',
    'OPTIONAL MATCH (movie)<-[r:ACTED_IN]-(a:Person)',
    'OPTIONAL MATCH (related:Movie)<--(a:Person) WHERE related <> movie',
    'OPTIONAL MATCH (movie)-[:HAS_KEYWORD]->(keyword:Keyword)',
    'OPTIONAL MATCH (movie)-[:HAS_GENRE]->(genre:Genre)',
    'OPTIONAL MATCH (movie)<-[:DIRECTED]-(d:Person)',
    'OPTIONAL MATCH (movie)<-[:PRODUCED]-(p:Person)',
    'OPTIONAL MATCH (movie)<-[:WRITER_OF]-(w:Person)',
    'WITH DISTINCT movie,',
    'my_rated,',
    'genre, keyword, d, p, w, a, r, related, count(related) AS countRelated',
    'ORDER BY countRelated DESC',
    'RETURN DISTINCT movie,',
    'my_rated.rating AS my_rating,',
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

var rate = function (session, movieId, userId, rating) {
  return session.run(
    'MATCH (u:User {id: {userId}}),(m:Movie {id: {movieId}}) \
    MERGE (u)-[r:RATED]->(m) \
    SET r.rating = {rating} \
    RETURN m',
    {
      userId: userId,
      movieId: parseInt(movieId),
      rating: parseInt(rating)
    }
  );
};

var deleteRating = function (session, userId, movieId) {
  return session.run(
    'MATCH (u:User {id: {userId}})-[r:RATED]->(m:Movie {id: {movieId}}) DELETE r',
    {userId: userId, movieId: movieId}
  );
};

var getRatedByUser = function (session, userId) {
  return session.run(
    'MATCH (:User {id: {userId}})-[rated:RATED]->(movie:Movie) \
     RETURN DISTINCT movie, rated.rating as my_rating',
    {userId: userId}
  ).then(result => {
    return result.records.map(r => {
      return new Movie(r.get('movie'), r.get('my_rating'));
    })
  });
};

// export exposed functions
module.exports = {
  getAll: getAll,
  getById: getById,
  getByDateRange: getByDateRange, // unused
  getByActor: getByActor,
  getByGenre: getByGenre, //unused
  getMoviesbyDirector: getByDirector,
  getMoviesByWriter: getByWriter,
  rate: rate,
  deleteRating: deleteRating,
  getRatedByUser: getRatedByUser
};