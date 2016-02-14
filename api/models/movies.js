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
  if (results.length) {
    callback(null, new Movie(results[0].movie));
  } else {
    callback(null, null);
  }
};

var _singleMovieWithGenres = function (results, callback) {
    if (results.length)
    {
      var thisMovie = new Movie(results[0].movie);
      thisMovie.genres = results[0].genres;
      thisMovie.directors = results[0].directors;
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

var _matchById = function (params, options, callback) {
  var cypher_params = {
    n: parseInt(params.id || 1)
  };

  var query = [
    'MATCH (movie:Movie)',
    'WHERE id(movie) = {n}',
    'RETURN movie'
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
    'RETURN movie, collect(genre.name) as genres',
    'ORDER BY movie.released DESC'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _getMovieByTitle = function (params, options, callback) {
  var cypher_params = {
    title: params.title
  };
  var query = [
    'MATCH (movie:Movie {title: {title} })<-[:ACTED_IN]-(actor)',
    'WITH movie, actor, length((actor)-[:ACTED_IN]->()) as actormoviesweight',
    'ORDER BY actormoviesweight DESC',
    'WITH movie, collect({name: actor.name, poster_image: actor.poster_image, weight: actormoviesweight}) as actors', 
    'MATCH (movie)-[:HAS_GENRE]->(genre)',
    'WITH movie, actors, collect(genre.name) as genres',
    'MATCH (director)-[:DIRECTED]->(movie)',
    'WITH movie, actors, genres, collect(director.name) as directors',
    'MATCH (writer)-[:WRITER_OF]->(movie)',
    'WITH movie, actors, genres, directors, collect(writer.name) as writers',
    'MATCH (movie)-[:HAS_KEYWORD]->(keyword)<-[:HAS_KEYWORD]-(movies:Movie)',
    'WITH DISTINCT movies as related, count(DISTINCT keyword.name) as keywords, movie, genres, directors, actors, writers',
    'ORDER BY keywords DESC',
    'WITH collect(DISTINCT { related: { title: related.title, poster_image: related.poster_image }, weight: keywords }) as related, movie, actors, genres, directors, writers',
    'MATCH (movie)-[:HAS_KEYWORD]->(keyword)',
    'WITH keyword, related, movie, actors, genres, directors, writers',
    'LIMIT 10',
    'RETURN collect(keyword.name) as keywords, related, movie, actors, genres, directors, writers'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _matchByGenre = function (params, options, callback) {
  var cypher_params = {
    name: params.name
  };

  var query = [
    'MATCH (movie:Movie)-[:HAS_GENRE]->(genre)',
    'WHERE genre.name = {name}',
    'RETURN movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _getByActor = function (params, options, callback) {
  var cypher_params = {
    name: params.name
  };

  var query = [
    'MATCH (actor:Person {name: {name} })',
    'MATCH (actor)-[:ACTED_IN]->(movie)', 
    'RETURN movie'
  ].join('\n');

  callback(null, query, cypher_params);
};


var _matchByUUID = Cypher(_matchById, ['id']);
var _matchByTitle = Cypher(_getMovieByTitle, _singleMovieWithGenres);

var _matchAll = _.partial(_matchBy, []);


// gets n random movies
var _getRandom = function (params, options, callback) {
  var cypher_params = {
    n: parseInt(params.n || 1)
  };

  var query = [
    'MATCH (movie:Movie)',
    'RETURN movie, rand() as rnd',
    'ORDER BY rnd',
    'LIMIT {n}'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _getAllCount = function (params, options, callback) {
  var cypher_params = {};

  var query = [
    'MATCH (movie:Movie)',
    'RETURN COUNT(movie) as c'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _updateName = function (params, options, callback) {
  var cypher_params = {
    id : params.id,
    name : params.name
  };

  var query = [
    'MATCH (movie:Movie {id:{id}})',
    'SET movie.name = {name}',
    'RETURN movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

// creates the movie with cypher
var _create = function (params, options, callback) {
  var cypher_params = {
    id: params.id || uuid(),
    name: params.name
  };

  var query = [
    'MERGE (movie:Movie {name: {name}, id: {id}})',
    'ON CREATE',
    'SET movie.created = timestamp()',
    'ON MATCH',
    'SET movie.lastLogin = timestamp()',
    'RETURN movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

// delete the movie and any relationships with cypher
var _delete = function (params, options, callback) {
  var cypher_params = {
    id: params.id
  };

  var query = [
    'MATCH (movie:Movie {id:{id}})',
    'OPTIONAL MATCH (movie)-[r]-()',
    'DELETE movie, r',
  ].join('\n');
  callback(null, query, cypher_params);
};

// delete all movies
var _deleteAll = function (params, options, callback) {
  var cypher_params = {};

  var query = [
    'MATCH (movie:Movie)',
    'OPTIONAL MATCH (movie)-[r]-()',
    'DELETE movie, r',
  ].join('\n');
  callback(null, query, cypher_params);
};


// exposed functions


// get a single movie by id
var getById = Cypher(_matchById, _singleMovie);

// Get by date range
var getByDateRange = Cypher(_getByDateRange, _manyMovies);

// Get by date range
var getByActor = Cypher(_getByActor, _manyMovies);

// get a single movie by name
var getByTitle = Cypher(_getMovieByTitle, _singleMovieWithGenres);

// get a movie by id and update their name
var updateName = Cypher(_updateName, _singleMovie);

// get a movie by genre
var getByGenre = Cypher(_matchByGenre, _manyMovies);

var getManyMoviesWithGenres = Cypher(_getMoviesWithGenres, _manyMoviesWithGenres);

// create a new movie
var create = Cypher(_create, _singleMovie);

// create many new movies
var createMany = function (params, options, callback) {
  if (params.names && _.isArray(params.names)) {
    async.map(params.names, function (name, callback) {
      create({name: name}, options, callback);
    }, function (err, responses) {
      Cypher.mergeReponses(err, responses, callback);
    });
  } else if (params.movies && _.isArray(params.movies)) {
    async.map(params.movies, function (movie, callback) {
      create(_.pick(movie, 'name', 'id'), options, callback);
    }, function (err, responses) {
      Cypher.mergeReponses(err, responses, callback);
    });
  } else {
    callback(null, []);
  }
};

var createRandom = function (params, options, callback) {
  var names = _randomNames(params.n || 1);
  createMany({names: names}, options, callback);
};

// login a movie
var login = create;

// get all movies
var getAll = Cypher(_matchAll, _manyMovies);

// get all movies count
var getAllCount = Cypher(_getAllCount, _singleCount);

// delete a movie by id
var deleteMovie = Cypher(_delete);

// delete a movie by id
var deleteAllMovies = Cypher(_deleteAll);

// reset all movies
var resetMovies = function (params, options, callback) {
  deleteAllMovies(null, options, function (err, response) {
    if (err) return callback(err, response);
    createRandom(params, options, function (err, secondResponse) {
      if (err) return Cypher.mergeRaws(err, [response, secondResponse], callback);
      manyFriendships({
        movies: secondResponse.results,
        friendships: params.friendships
      }, options, function (err, finalResponse) {
        // this doesn't return all the movies, just the ones with friends
        Cypher.mergeRaws(err, [response, secondResponse, finalResponse], callback);
      });
    });
  });
};

// export exposed functions

module.exports = {
  getAll: getManyMoviesWithGenres,
  getById: getById,
  getByTitle: getByTitle,
  getByDateRange: getByDateRange,
  getByActor: getByActor,
  getByGenre: getByGenre
};