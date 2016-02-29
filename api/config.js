'use strict';

var nconf = require('nconf');
//var USER_NAME = 'neo4j';
//var PASSWORD = '12345678';

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
      default: "remote"
    }
  })
  .file({file: './api/config/settings.json'})
  .defaults({
    'neo4j': 'remote',
    'neo4j-local': 'http://localhost:7474', // http://usernama@password:localhost:7474
    'neo4j-remote': 'http://162.243.100.222:7474',
    'base_url': 'http://localhost:3000',
    'api_path': '/api/v0'
  });

module.exports = nconf;