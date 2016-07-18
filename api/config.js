'use strict';

var nconf = require('nconf');
var auth = '';

// If your database using authenticaion, uncomment the three lines below
// and update your credentials

// var USER_NAME = 'neo4j';   // use your username
// var PASSWORD = 'neo4j';    // use your password
// var auth = USER_NAME + ':' + PASSWORD + '@'

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
    'neo4j': 'local',
    'neo4j-local': 'http://' + auth + 'localhost:7474',
    'neo4j-remote': 'http://162.243.100.222:7474',
    'base_url': 'http://localhost:3000',
    'api_path': '/api/v0'
  });

module.exports = nconf;