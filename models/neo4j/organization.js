var _ = require('lodash');

var Organization = module.exports = function (_node) {
  var name = _node.properties['name'];

  _.extend(this, {
    'id': _node.properties['id'],
    'name': name,
  });
};