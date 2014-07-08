/**
 *  neo4j genre functions
 *  these are mostly written in a functional style
 */


var _ = require('underscore');
var uuid = require('hat'); // generates uuids
var Genre = require('../models/neo4j/genre');
var Cypher = require('../neo4j/cypher');
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

// return a single genre
var _singleGenre = function (results, callback) {
  if (results.length) {
    var genre = new Genre(results[0].genre);
    genre.movies = results[0].movie;
    genre.related = results[0].related;
    callback(null, genre);
  } else {
    callback(null, null);
  }
};

// return many genres
var _manyGenres = function (results, callback) {
  var genres = _.map(results, function (result) {
    return new Genre(result.genre);
  });

  callback(null, genres);
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
    'MATCH (genre:Genre)',
    Cypher.where('genre', keys),
    'RETURN genre'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _getViewByName = function (params, options, callback) {
  var cypher_params = {
    name: params.name
  };

  var query = [
    'MATCH (genre:Genre {name: {name}})',
    'MATCH (genre:Genre)-[relatedTo]-(movie:Movie)', 
    'OPTIONAL MATCH (genre)-[:ACTED_IN]->(movies)<-[:ACTED_IN]-(genres)',
    'WITH DISTINCT { name: genres.name, poster_image: genres.poster_image } as related, count(DISTINCT movies) as weight, movie, genre',
    'ORDER BY weight DESC',
    'RETURN collect(DISTINCT { title: movie.title, poster_image: movie.poster_image }) as movie, collect(DISTINCT { related: related, weight: weight }) as related, genre'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _matchByUUID = _.partial(_matchBy, ['id']);
var _matchAll = _.partial(_matchBy, []);

// gets n random genres
var _getRandom = function (params, options, callback) {
  var cypher_params = {
    n: parseInt(params.n || 1)
  };

  var query = [
    'MATCH (genre:Genre)',
    'RETURN genre, rand() as rnd',
    'ORDER BY rnd',
    'LIMIT {n}'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _getAllCount = function (params, options, callback) {
  var cypher_params = {};

  var query = [
    'MATCH (genre:Genre)',
    'RETURN COUNT(genre) as c'
  ].join('\n');

  callback(null, query, cypher_params);
};

var _updateName = function (params, options, callback) {
  var cypher_params = {
    id : params.id,
    name : params.name
  };

  var query = [
    'MATCH (genre:Genre {id:{id}})',
    'SET genre.name = {name}',
    'RETURN genre'
  ].join('\n');

  callback(null, query, cypher_params);
};

// creates the genre with cypher
var _create = function (params, options, callback) {
  var cypher_params = {
    id: params.id || uuid(),
    name: params.name
  };

  var query = [
    'MERGE (genre:Genre {name: {name}, id: {id}})',
    'ON CREATE',
    'SET genre.created = timestamp()',
    'ON MATCH',
    'SET genre.lastLogin = timestamp()',
    'RETURN genre'
  ].join('\n');

  callback(null, query, cypher_params);
};

// delete the genre and any relationships with cypher
var _delete = function (params, options, callback) {
  var cypher_params = {
    id: params.id
  };

  var query = [
    'MATCH (genre:Genre {id:{id}})',
    'OPTIONAL MATCH (genre)-[r]-()',
    'DELETE genre, r',
  ].join('\n');
  callback(null, query, cypher_params);
};

// delete all genres
var _deleteAll = function (params, options, callback) {
  var cypher_params = {};

  var query = [
    'MATCH (genre:Genre)',
    'OPTIONAL MATCH (genre)-[r]-()',
    'DELETE genre, r',
  ].join('\n');
  callback(null, query, cypher_params);
};

// get a single genre by id
var getById = Cypher(_matchByUUID, _singleGenre);

// get a single genre by name
var getByName = Cypher(_getViewByName, _singleGenre);

// get n random genres
var getRandom = Cypher(_getRandom, _manyGenres);

// // get n random genres
// var getRandomWithFriends = Cypher(_getRandomWithFriends, _manyGenresWithFriends);

// get a genre by id and update their name
var updateName = Cypher(_updateName, _singleGenre);

// create a new genre
var create = Cypher(_create, _singleGenre);

// get all genres
var getAll = Cypher(_matchAll, _manyGenres);

// get all genres count
var getAllCount = Cypher(_getAllCount, _singleCount);

// delete a genre by id
var deleteGenre = Cypher(_delete);

// delete a genre by id
var deleteAllGenres = Cypher(_deleteAll);


// export exposed functions

module.exports = {
  getAll: getAll
};