
// extracts just the data from the query results

var _ = require('underscore');

var Role = module.exports = function (_node) {
  _(this).extend(_node.data);
};