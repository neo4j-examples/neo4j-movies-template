// extracts just the data from the query results

var _ = require('underscore');

var User = module.exports = function (_node) {
  _(this).extend({
    'id': _node.properties['id'],
    'username': _node.properties['username'],
    'avatar': {
      'full_size': 'https://www.gravatar.com/avatar'
    }
  });
};