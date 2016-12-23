'use strict';

var nconf = require('nconf');

var USERNAME = 'neo4j';   // use your username
var PASSWORD = 'neo4j';    // use your password

nconf.env(['PORT', 'NODE_ENV'])
  .argv({
    'e': {
      alias: 'NODE_ENV',
      describe: 'Set production or development mode.',
      demand: false,
      default: 'development'
    },
    'p': {
      alias: 'PORT',
      describe: 'Port to run on.',
      demand: false,
      default: 3000
    },
    'n': {
      alias: "neo4j",
      describe: "Use local or remote neo4j instance",
      demand: false,
      default: "local"
    }
  })
  .defaults({
    'USERNAME': USERNAME,
    'PASSWORD' : PASSWORD,
    'neo4j': 'local',
    'neo4j-local': 'bolt://localhost:7687',
    'neo4j-remote': 'bolt:http://162.243.100.222:7687',
    'base_url': 'http://localhost:3000',
    'api_path': '/api/v0'
  });

module.exports = nconf;