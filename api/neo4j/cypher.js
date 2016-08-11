// neo4j cypher helper module
nconf = require('../config'),
_ = require('underscore');
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver(nconf.get('neo4j-local'), neo4j.auth.basic(nconf.get('USERNAME'), nconf.get('PASSWORD')));

if(nconf.get('neo4j') == 'remote'){
  driver = neo4j.driver(nconf.get('neo4j-remote'), neo4j.auth.basic(nconf.get('USERNAME'), nconf.get('PASSWORD')));
}

var session = driver.session();

var Cypher = function(queryFn, resultsFn, resultsOptions) {
  return function(params, options, callback) {
    queryFn(params, options, function(err, query, cypher_params) {
      if (err) {
        return callback(err, formatResponse(options, null, query, cypher_params, null, err));
      } else {
        var myResult = [];
        session.run(query, cypher_params).then(function(result) {
            result.records.forEach(function(record) {
            myResult.push(resultsFn(record))
            if (resultsOptions && resultsOptions.single) { myResult = myResult[0] } 
            }); // Completed!
            return callback(err, {
              results: myResult
            });
            session.close();
          })
          .catch(function(error) {
            console.log(error);
        });
      };
    });
  };
};

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
