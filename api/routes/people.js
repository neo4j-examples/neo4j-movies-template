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
      // param.query("friends", "Include friends", "boolean", false, false, "LIST[true, false]", "true")
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
    // var friends = parseBool(req, 'friends');
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

exports.findPersonByDirectedMovie = {
  'spec': {
    "description" : "Find a director",
    "path" : "/people/director/movie/{title}",
    "notes" : "Returns a person who directed a movie",
    "summary" : "Find person who directed a movie by title",
    "method": "GET",
    "params" : [
      param.path("title", "Title of the movie that the person directed", "string")
    ],
    "responseClass" : "Person",
    "errorResponses" : [swe.invalid('title'), swe.notFound('person')],
    "nickname" : "getPersonByDirectedMovie"
  },
  'action': function (req,res) {
    var title = req.params.title;
    var options = {
      neo4j: parseBool(req, 'neo4j')
    };
    var start = new Date();

    if (!title) throw swe.invalid('title');

    var params = {
      title: title
    };

    var callback = function (err, response) {
      if (err) throw swe.notFound('person');
      writeResponse(res, response, start);
    };


    People.getDirectorByMovie(params, options, callback);

  }
};

exports.findActorsByCoActor = {
  'spec': {
    "description" : "Find co-actors of person",
    "path" : "/people/coactors/person/{name}",
    "notes" : "Returns all people that acted in a movie with a person",
    "summary" : "Find all people that acted in a movie with a person",
    "method": "GET",
    "params" : [
      param.path("name", "Name of the person with co-actors", "string")
    ],
    "responseClass" : "List[Person]",
    "errorResponses" : [swe.notFound('people')],
    "nickname" : "getCoActorsOfPerson"
  },
  'action': function (req, res) {
    var name = req.params.name;
    var options = {
      neo4j: parseBool(req, 'neo4j')
    };
    var start = new Date();

    if (!name) throw swe.invalid('name');

    var params = {
      name: name
    };

    var callback = function (err, response) {
      if (err) throw swe.notFound('person');
      writeResponse(res, response, start);
    };


    People.getCoActorsByPerson(params, options, callback);
  }
};

exports.findRolesByMovie = {
  'spec': {
    "description" : "Find people with a role in a movie",
    "path" : "/people/roles/movie/{title}",
    "notes" : "Returns all people and their role in a movie",
    "summary" : "Find all people and their role in a movie",
    "method": "GET",
    "params" : [
      param.path("title", "Title of the movie", "string")
    ],
    "responseClass" : "List[Role]",
    "errorResponses" : [swe.notFound('roles')],
    "nickname" : "getRolesByMovie"
  },
  'action': function (req, res) {
    var title = req.params.title;
    var options = {
      neo4j: parseBool(req, 'neo4j')
    };
    var start = new Date();

    if (!title) throw swe.invalid('title');

    var params = {
      title: title
    };

    var callback = function (err, response) {
      if (err) throw swe.notFound('role');
      writeResponse(res, response, start);
    };


    People.getRolesByMovie(params, options, callback);
  }
};

exports.personCount = {
  'spec': {
    "description" : "Person count",
    "path" : "/people/count",
    "notes" : "Person count",
    "summary" : "Person count",
    "method": "GET",
    "params" : [],
    "responseClass" : "Count",
    "errorResponses" : [swe.notFound('people')],
    "nickname" : "personCount"
  },
  'action': function (req, res) {
    var options = {
      neo4j: parseBool(req, 'neo4j')
    };
    var start = new Date();
    People.getAllCount(null, options, function (err, response) {
      // if (err || !response.results) throw swe.notFound('people');
      writeResponse(res, response, start);
    });
  }
};

exports.addPerson = {
  'spec': {
    "path" : "/people",
    "notes" : "adds a person to the graph",
    "summary" : "Add a new person to the graph",
    "method": "POST",
    "responseClass" : "List[Person]",
    "params" : [
      param.query("name", "Person name, seperate multiple names by commas", "string", true, true)
    ],
    "errorResponses" : [swe.invalid('input')],
    "nickname" : "addPerson"
  },
  'action': function(req, res) {
    var options = {
      neo4j: parseBool(req, 'neo4j')
    };
    var start = new Date();
    var names = _.invoke(parseUrl(req, 'name').split(','), 'trim');
    if (!names.length){
      throw swe.invalid('name');
    } else {
      People.createMany({
        names: names
      }, options, function (err, response) {
        if (err || !response.results) throw swe.invalid('input');
        writeResponse(res, response, start);
      });
    }
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


exports.addRandomPeople = {
  'spec': {
    "path" : "/people/random/{n}",
    "notes" : "adds many random people to the graph",
    "summary" : "Add many random new people to the graph",
    "method": "POST",
    "responseClass" : "List[Person]",
    "params" : [
      param.path("n", "Number of random people to be created", "integer", null, 1)
    ],
    "errorResponses" : [swe.invalid('input')],
    "nickname" : "addRandomPeople"
  },
  'action': function(req, res) {
    var options = {
      neo4j: parseBool(req, 'neo4j')
    };
    var start = new Date();
    var n = parseInt(req.params.n, 10);
    if (!n){
      throw swe.invalid('input');
    } else {
      People.createRandom({n:n}, options, function (err, response) {
        if (err || !response.results) throw swe.invalid('input');
        writeResponse(res, response, start);
      });
    }
  }
};


exports.findByName = {
  'spec': {
    "description" : "find a person",
    "path" : "/people/name/{name}",
    "notes" : "Returns a person based on name",
    "summary" : "Find person by name",
    "method": "GET",
    "params" : [
      param.path("name", "Name of person that needs to be fetched", "string")
    ],
    "responseClass" : "Person",
    "errorResponses" : [swe.invalid('name'), swe.notFound('person')],
    "nickname" : "getPersonByName"
  },
  'action': function (req,res) {
    var name = req.params.name;
    var options = {
      neo4j: parseBool(req, 'neo4j')
    };
    var start = new Date();

    if (!name) throw swe.invalid('name');

    var params = {
      name: name
    };

    var callback = function (err, response) {
      if (err) throw swe.notFound('person');
      writeResponse(res, response, start);
    };

    People.getByName(params, options, callback);
  }
};