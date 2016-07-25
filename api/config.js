'use strict';

var nconf = require('nconf');
var auth = '';

// If your database is not using authenticaion, comment the three lines below

var USERNAME = 'neo4j';   // use your username
var PASSWORD = '123123';    // use your password
var auth = USERNAME + ':' + PASSWORD + '@'

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
    // 'neo4j-local': 'http://' + auth + 'localhost:7474',
    'neo4j-local': 'bolt:http://localhost:7687',
    'neo4j-remote': 'bolt:http://162.243.100.222:7687',
    'base_url': 'http://localhost:3000',
    'api_path': '/api/v0'
  });

module.exports = nconf;