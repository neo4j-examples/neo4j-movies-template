// extracts just the data from the query results

var _ = require('underscore');

var Person = module.exports = function (_node) {
  _(this).extend(_node.properties);
  if (this.id) { 
  	this.id = this.id.toNumber();
  }
  if (this.born) {
  	this.born = this.born.toNumber();
  }
};