// extracts just the data from the query results

var _ = require('underscore');

var Movie = module.exports = function (_node) {
  _(this).extend(_node.properties);
  if (this.id) { 
    this.id = this.id.toNumber();
  };
  if (this.duration) { 
    this.duration = this.duration.toNumber();
  };
};