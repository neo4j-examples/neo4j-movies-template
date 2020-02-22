// extracts just the data from the query results

var _ = require('lodash');

var Interest = module.exports = function (_node) {
  var interestName = _node.properties['interestName'];

  _.extend(this, {
    'id': _node.properties['id'],
    interestName
  });
};