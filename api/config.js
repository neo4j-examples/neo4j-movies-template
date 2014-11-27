'use strict';

var nconf = require('nconf');

nconf.defaults({
    'neo4j': 'local',
    'neo4j-local': 'http://localhost:7474',
    'neo4j-remote': 'http://default-environment-txj2pq5mwx.elasticbeanstalk.com/',
    'base_url': 'http://localhost:3000',
    'api_path': '/api/v0'
  })
  .env(['PORT','NODE_ENV'])
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
      default: "remote"
    }
  });

module.exports = nconf;