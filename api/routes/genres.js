// genres.js

var Genres = require("../models/genres");
var sw = require("swagger-node-express");
var param = sw.params;
var url = require("url");
var swe = sw.errors;
var _ = require("underscore");

/*
 *  Util Functions
 */

function writeResponse (res, response, start) {
  sw.setHeaders(res);
  res.header("Duration-ms", new Date() - start);
  if (response.neo4j) {
    res.header("Neo4j", JSON.stringify(response.neo4j));
  }
  res.send(JSON.stringify(response.results));
}

function parseUrl(req, key) {
  return url.parse(req.url,true).query[key];
}

function parseBool (req, key) {
  return 'true' == url.parse(req.url,true).query[key];
}


/*
 * API Specs and Functions
 */

exports.list = {
  "spec": {
    "description" : "List all genres",
    "path" : "/genres",
    "notes" : "Returns all genres",
    "summary" : "Find all genres",
    "method": "GET",
    "params" : [],
    "responseClass" : "List[Genre]",
    "errorResponses" : [swe.notFound("genre")],
    "nickname" : "getGenre"
  },
  "action": function (req, res) {
    // var friends = parseBool(req, 'friends');
    var options = {
      neo4j: parseBool(req, "neo4j")
    };
    var start = new Date();

      Genres.getAll(null, options, function (err, response) {
        if (err || !response.results) throw swe.notFound("genres");
        writeResponse(res, response, start);
      });
  }
};