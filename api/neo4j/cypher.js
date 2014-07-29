// neo4j cypher helper module


var neo4j = require('neo4j'),
    //db = new neo4j.GraphDatabase('http://162.243.116.40:7474/'),
    //db = new neo4j.GraphDatabase('http://neo4jmovies_backup:s85HZuuCPlaS6T6y7H8f@neo4jmoviesbackup.sb01.stations.graphenedb.com:24789/'),
    db = new neo4j.GraphDatabase('http://localhost:7474/'),
    _ = require('underscore')
;

function formatResponse (options, finalResults, query, cypher_params, results, err) {
  if (err) console.log(err);

  // if options.neo4j == true, add cypher query, params, results, and err to response
  if (options && options.neo4j) {
    return {
      results: finalResults,
      neo4j: neo4jObj(query, cypher_params, results, err)
    };
  } else {
    return {
      results: finalResults
    };
  }
}

function neo4jObj (query, cypher_params, results, err) {
  return {
    query: query,
    params: cypher_params,
    results: _cleanResults(results),
    err: err
  };
}

/* Cypher
 * returns a combined function for creating cypher queries and processing the results
 *
 * queryFn : takes in params and options and returns a callback with the cypher query
 *
 * resultsFn : takes the results from a cypher query and does something and then callback
 *
 * db.query : executes a cypher query to neo4j
 *
 * formatResponse : structures the results based on options param
 */

var Cypher = function (queryFn, resultsFn) {
  return function (params, options, callback) {
    queryFn(params, options, function (err, query, cypher_params) {
      if (err) {
        return callback(err, formatResponse(options, null, query, cypher_params, null, err));
      }
      db.query(query, cypher_params, function (err, results) {
        if (err || !_.isFunction(resultsFn)) {
          return callback(err, formatResponse(options, null, query, cypher_params, results, err));
        } else {
          resultsFn(results, function (err, finalResults) {
            return callback(err, formatResponse(options, finalResults, query, cypher_params, results, err));
          });
        }
      });
    });
  };
};

// merges an array of responses
Cypher.mergeReponses = function (err, responses, callback) {
  var response = {};
  if (responses.length) {
    response.results = _.pluck(responses, 'results');
    if (responses[0] && responses[0].neo4j) {
      response.neo4j = _.pluck(responses, 'neo4j');
    }
  }
  callback(err, response);
};

// merges only neo4j in an array of responses
Cypher.mergeRaws = function (err, responses, callback) {
  var response = {};
  if (responses.length) {
    response.results = _.last(responses).results;
    if (responses[0].neo4j) {
      response.neo4j = _.pluck(responses, 'neo4j');
    }
  }
  callback(err, response);
};

/*
 *  Neo4j results cleaning functions
 *  strips RESTful data from cypher results
 */

// creates a clean results which removes all non _data properties from nodes/rels
function _cleanResults (results, stringify) {
  var clean = _.map(results, function (res) {
    return _.reduce(res, _cleanObject, {});
  });
  if (stringify) return JSON.stringify(clean, '', '  ');
  return clean;
}

// copies only the data from nodes/rels to a new object
function _cleanObject (memo, value, key) {
  if (_hasData(value)) {
    memo[key] = value._data.data;
  } else if (_.isArray(value)) {
    memo[key] = _.reduce(value, _cleanArray, []);
  } else {
    memo[key] = value;
  }
  return memo;
}

// cleans an array of nodes/rels
function _cleanArray (memo, value) {
  if (_hasData(value)) {
    return memo.concat(value._data.data);
  } else if (_.isArray(value)) {
    return memo.concat(_.reduce(value, _cleanArray, []));
  } else {
    return memo.concat(value);
  }
}

function _hasData (value) {
  return _.isObject(value) && value._data;
}


/**
 *  Util Functions
 */

var _whereTemplate = function (name, key, paramKey) {
  return name +'.'+key+'={'+(paramKey || key)+'}';
};

Cypher.where = function (name, keys) {
  if (_.isArray(name)) {
    _.map(name, function (obj) {
      return _whereTemplate(obj.name, obj.key, obj.paramKey);
    });
  } else if (keys && keys.length) {
    return 'WHERE '+_.map(keys, function (key) {
      return _whereTemplate(name, key);
    }).join(' AND ');
  }
};

module.exports = Cypher;