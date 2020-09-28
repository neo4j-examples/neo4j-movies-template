// extracts just the data from the query results

var _ = require('lodash');

var Person = module.exports = function (_node) {
  _.extend(this, _node.properties);
  this.id = this.tmdbId;
  this.poster_image = this.poster;
};
