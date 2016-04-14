// people.js

var People = require('../models/people');
var Genres = require('../models/genres');

var sw = require("swagger-node-express");
var param = sw.params;
var url = require("url");
var swe = sw.errors;
var _ = require('underscore');

/*
 *  Util Functions
 */

function writeResponse (res, response, start) {
  sw.setHeaders(res);
  res.header('Duration-ms', new Date() - start);
  if (response.neo4j) {
    res.header('Neo4j', JSON.stringify(response.neo4j));
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
  'spec': {
    "description" : "List all people",
    "path" : "/people",
    "notes" : "Returns all people",
    "summary" : "Find all people",
    "method": "GET",
    "params" : [
    ],
    "responseClass" : "List[Person]",
    "errorResponses" : [swe.notFound('people')],
    "nickname" : "getPeople"
  },
  'action': function (req, res) {
    // var friends = parseBool(req, 'friends');
    var options = {
      neo4j: parseBool(req, 'neo4j')
    };
    var start = new Date();
      People.getAll(null, options, function (err, response) {
        if (err || !response.results) throw swe.notFound('people');
        writeResponse(res, response, start);
      });
  }
};

exports.listgenres = {
  'spec': {
    "description" : "List all genres",
    "path" : "/genres",
    "notes" : "Returns all genres",
    "summary" : "Find all genres",
    "method": "GET",
    "params" : [],
    "responseClass" : "List[Genre]",
    "errorResponses" : [swe.notFound('genre')],
    "nickname" : "getGenre"
  },
  'action': function (req, res) {
    var options = {
      neo4j: parseBool(req, 'neo4j')
    };
    var start = new Date();

      Genres.getAll(null, options, function (err, response) {
        if (err || !response.results) throw swe.notFound('genres');
        writeResponse(res, response, start);
      });
  }
};

exports.findFiveMostRelated = {
  'spec': {
    "description" : "Find the five most related people to a person",
    "path" : "/people/related/{id}",
    "notes" : "Returns the 25 most related people to a person",
    "summary" : "Returns the 25 most related people to a person",
    "method": "GET",
    "params" : [
      param.path("id", "id of the person", "integer")
    ],
    "responseClass" : "List[Person]",
    "errorResponses" : [swe.notFound('people')],
    "nickname" : "getFiveMostRelated"
  },
  'action': function (req, res) {
    var id = req.params.id;
    var options = {
      neo4j: parseBool(req, 'neo4j')
    };
    var start = new Date();

    if (!id) throw swe.invalid('id');

    var params = {
      id: id
    };

    var callback = function (err, response) {
      if (err) throw swe.notFound('person');
      writeResponse(res, response, start);
    };

    People.getFiveMostRelated(params, options, callback);
  }
};

exports.getBaconPeople = {
  'spec': {
    "description" : "List all people",
    "path" : "/people/bacon/",
    "notes" : "Returns all Bacon paths from person 1 to person 2",
    "summary" : "Find all Bacon paths",
    "method": "GET",
    "params" : [
      param.query("name1", "Name of the origin user", "string",true, true),
      param.query("name2", "Name of the target user", "string",true, true)
    ],
    "responseClass" : "List[Person]",
    "errorResponses" : [swe.notFound('people')],
    "nickname" : "getBaconPeople"
  },
  'action': function (req,res) {
    var name1 = req.query.name1;
    var name2 = req.query.name2;

    var options = {
      neo4j: parseBool(req, 'neo4j')
    };
    var start = new Date();

    var params = {
      name1: name1,
      name2: name2
    };

      People.getBaconPeople(params, options, function (err, response) {
        if (err || !response.results) throw swe.notFound('people');
        writeResponse(res, response, start);
      });
  }
};

exports.findById = {
  'spec': {
    "description" : "find a person",
    "path" : "/people/{id}",
    "notes" : "Returns a person based on id",
    "summary" : "Find person by id",
    "method": "GET",
    "params" : [
      param.path("id", "id of person that needs to be fetched", "integer")
    ],
    "responseClass" : "Person",
    "errorResponses" : [swe.invalid('id'), swe.notFound('person')],
    "nickname" : "getPersonById"
  },
  'action': function (req,res) {
    var id = req.params.id;
    var options = {
      neo4j: parseBool(req, 'neo4j')
    };
    var start = new Date();

    if (!id) throw swe.invalid('id');

    var params = {
      id: id
    };

    var callback = function (err, response) {
      if (err) throw swe.notFound('person');
      writeResponse(res, response, start);
    };

    People.getById(params, options, callback);
  }
};