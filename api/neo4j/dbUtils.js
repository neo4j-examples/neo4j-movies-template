"use strict";

// neo4j cypher helper module
var nconf = require('../config'),
  _ = require('underscore');

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver(nconf.get('neo4j-local'), neo4j.auth.basic(nconf.get('USERNAME'), nconf.get('PASSWORD')));

if (nconf.get('neo4j') == 'remote') {
  driver = neo4j.driver(nconf.get('neo4j-remote'), neo4j.auth.basic(nconf.get('USERNAME'), nconf.get('PASSWORD')));
}

exports.getSession = function () {
  return driver.session();
};

