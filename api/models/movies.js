/**
 *  neo4j movie functions
 *  these are mostly written in a functional style
 */

var _ = require('underscore');
var uuid = require('hat'); // generates uuids
var Cypher = require('../neo4j/cypher');
var Movie = require('../models/neo4j/movie');
var async = require('async');
var randomName = require('random-name');

/*
 *  Utility Functions
 */

function _randomName () {
  return randomName.first() + ' ' + randomName.last();
}

function _randomNames (n) {
  return _.times(n, _randomName);
}

/**
 *  Result Functions
 *  to be combined with queries using _.partial()
 */

// return a single movie
var _singleMovie = function (results, callback) {
if (results.length)
    {
      var thisMovie = new Movie(results[0].movie);
      thisMovie.related = results[0].related;
      callback(null, thisMovie);
    } else {
      callback(null, null);
    }
};

var _singleMovieWithDetails = function (results, callback) {
    if (results.length)
    {
      var thisMovie = new Movie(results[0].movie);
      thisMovie.genres = results[0].genres;
      thisMovie.directors = results[0].directors;
      thisMovie.producers = results[0].producers;
      thisMovie.writers = results[0].writers;
      thisMovie.actors = results[0].actors;
      thisMovie.related = results[0].related;
      thisMovie.keywords = results[0].keywords;
      callback(null, thisMovie);
    } else {
      callback(null, null);
    }
};

// return many movies
var _manyMovies = function (results, callback) {
  var movies = _.map(results, function (result) {
    return new Movie(result.movie);
  });

  callback(null, movies);
};

var _manyMoviesWithGenres = function (results, callback) {
  var movies = _.map(results, function (result) {
    var thisMovie = new Movie(result.movie);
    thisMovie.genres = result.genres;
    return thisMovie;
  });

  callback(null, movies);
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
    'MATCH (movie:Movie)',
    Cypher.where('movie', keys),
    'RETURN movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

// returns data needed to build the movie detail page
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
    'collect(DISTINCT{ name:keyword.name, id:keyword.id }) AS keywords, ',
    'collect(DISTINCT{ name:d.name, id:d.id, poster_image:a.poster_image}) AS directors,',
    'collect(DISTINCT{ name:p.name, id:p.id, poster_image:a.poster_image}) AS producers,',
    'collect(DISTINCT{ name:w.name, id:w.id, poster_image:a.poster_image}) AS writers,',
    'collect(DISTINCT{ name:a.name, id:a.id, poster_image:a.poster_image, role:r.role}) AS actors,',
    'collect(DISTINCT{ title:related.title, id:related.id, poster_image:related.poster_image}) AS related,',
    'collect(DISTINCT{ name:genre.name, id:genre.id}) AS genres',
  ].join('\n');

  callback(null, query, cypher_params);
};

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

var _getMoviesWithGenres = function (params, options, callback) {
  var cypher_params = {};
  var query = [
    'MATCH (movie:Movie)',
    'WITH movie',
    'OPTIONAL MATCH (genre)<-[:HAS_GENRE]-(movie)',
    'WITH movie, genre', 
    'RETURN movie, collect(genre.name) AS genres',
    'ORDER BY movie.released DESC'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _matchByGenre = function (params, options, callback) {
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

var _getMoviesbyDirector = function (params, options, callback) {
  var cypher_params = {
    id: parseInt(params.id)
  };

  var query = [
    'MATCH (:Person {id:{id}})-[:DIRECTED]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _byWriter = function (params, options, callback) {
  var cypher_params = {
    id: parseInt(params.id)
  };

  var query = [
    'MATCH (:Person {id:{id}})-[:WRITER_OF]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _byProducer = function (params, options, callback) {
  var cypher_params = {
    id: parseInt(params.id)
  };

  var query = [
    'MATCH (:Person {id:{id}})-[:PRODUCED]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _matchAll = _.partial(_matchBy, []);

// exposed functions

// get a single movie by id
var getById = Cypher(_matchById, _singleMovieWithDetails);

// Get by date range
var getByDateRange = Cypher(_getByDateRange, _manyMovies);

// Get by date range
var getByActor = Cypher(_getByActor, _manyMovies);

// get a movie by genre
var getByGenre = Cypher(_matchByGenre, _manyMovies);

var getManyMoviesWithGenres = Cypher(_getMoviesWithGenres, _manyMoviesWithGenres);

// get all movies
var getAll = Cypher(_matchAll, _manyMovies);

// Get many movies directed by a person
var getMoviesbyDirector = Cypher(_getMoviesbyDirector, _manyMovies);

// Get many movies written by a person
var getMoviesByWriter = Cypher(_byWriter, _manyMovies);

// Get many movies produced by a person
var getMoviesByProducer = Cypher(_byProducer, _manyMovies);

// export exposed functions

module.exports = {
  getAll: getManyMoviesWithGenres,
  getById: getById,
  getByDateRange: getByDateRange,
  getByActor: getByActor,
  getByGenre: getByGenre,
  getMoviesbyDirector: getMoviesbyDirector,
  getMoviesByWriter: getMoviesByWriter
};