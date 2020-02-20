// extracts just the data from the query results

var _ = require('lodash');
var md5 = require('md5');

var User = module.exports = function (_node) {
  var username = _node.properties['username'];
  var firstName = _node.properties['firstName'];
  var lastName = _node.properties['lastName'];

  _.extend(this, {
    'id': _node.properties['id'],
    username,
    firstName,
    lastName,
    'avatar': {
      'full_size': 'https://www.gravatar.com/avatar/' + md5(username) + '?d=retro'
    }
  });
};