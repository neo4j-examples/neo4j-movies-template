var _ = require('lodash');
var dbUtils = require('../neo4j/dbUtils');
var Movie = require('../models/neo4j/movie');
var Person = require('../models/neo4j/person');
var Genre = require('../models/neo4j/genre');

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

function manyMovies(neo4jResult) {
  return neo4jResult.records.map(r => new Movie(r.get('movie')))
}

// get all movies
var getAll = function (session) {
  return session
    .run('MATCH (movie:Movie) RETURN movie')
    .then(r => manyMovies(r));
};

// get a single movie by id
var getById = function (session, movieId, userId) {
  var query = [
    'MATCH (movie:Movie {id: {movieId}})',
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

  return session.run(query, {
    movieId: parseInt(movieId),
    userId: userId
  }).then(result => {
    if (!_.isEmpty(result.records)) {
      return _singleMovieWithDetails(result.records[0]);
    }
    else {
      throw {message: 'movie not found', status: 404}
    }
  });
};

// Get by date range
var getByDateRange = function (session, start, end) {
  var query = [
    'MATCH (movie:Movie)',
    'WHERE movie.released > {start} AND movie.released < {end}',
    'RETURN movie'
  ].join('\n');

  return session.run(query, {
    start: parseInt(start || 0),
    end: parseInt(end || 0)
  }).then(result => manyMovies(result))
};

// Get by date range
var getByActor = function (session, id) {
  var query = [
    'MATCH (actor:Person {id:{id}})-[:ACTED_IN]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  return session.run(query, {
    id: parseInt(id)
  }).then(result => manyMovies(result))
};

// get a movie by genre
var getByGenre = function(session, genreId) {
  var query = [
    'MATCH (movie:Movie)-[:HAS_GENRE]->(genre)',
    'WHERE genre.id = {genreId}',
    'RETURN movie'
  ].join('\n');

  return session.run(query, {
    genreId: parseInt(genreId)
  }).then(result => manyMovies(result));
};

// Get many movies directed by a person
var getByDirector = function(session, personId) {
  var query = [
    'MATCH (:Person {id:{personId}})-[:DIRECTED]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  return session.run(query, {
    personId: parseInt(personId)
  }).then(result => manyMovies(result));
};

// Get many movies written by a person
var getByWriter = function(session, personId) {
  var query = [
    'MATCH (:Person {id:{personId}})-[:WRITER_OF]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  return session.run(query, {
    personId: parseInt(personId)
  }).then(result => manyMovies(result));
};

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

var deleteRating = function (session, movieId, userId) {
  return session.run(
    'MATCH (u:User {id: {userId}})-[r:RATED]->(m:Movie {id: {movieId}}) DELETE r',
    {userId: userId, movieId: parseInt(movieId)}
  );
};

var getRatedByUser = function (session, userId) {
  return session.run(
    'MATCH (:User {id: {userId}})-[rated:RATED]->(movie:Movie) \
     RETURN DISTINCT movie, rated.rating as my_rating',
    {userId: userId}
  ).then(result => {
    return result.records.map(r => new Movie(r.get('movie'), r.get('my_rating')))
  });
};

var getRecommended = function (session, userId) {
  return session.run(
    'MATCH (me:User {id: {userId}})-[my:RATED]->(m:Movie) \
  MATCH (other:User)-[their:RATED]->(m) \
  WHERE me <> other \
  AND abs(my.rating - their.rating) < 2 \
  WITH other,m \
  MATCH (other)-[otherRating:RATED]->(movie:Movie) \
  WHERE movie <> m \
  WITH avg(otherRating.rating) AS avgRating, movie \
  RETURN movie \
  ORDER BY avgRating desc \
  LIMIT 25',
    {userId: userId}
  ).then(result => manyMovies(result)
  );
};

// export exposed functions
module.exports = {
  getAll: getAll,
  getById: getById,
  getByDateRange: getByDateRange,
  getByActor: getByActor,
  getByGenre: getByGenre,
  getMoviesbyDirector: getByDirector,
  getMoviesByWriter: getByWriter,
  rate: rate,
  deleteRating: deleteRating,
  getRatedByUser: getRatedByUser,
  getRecommended: getRecommended
};