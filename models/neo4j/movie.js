// extracts just the data from the query results

var _ = require('lodash');

var Movie = module.exports = function (_node, myRating) {
  _.extend(this, _node.properties);

  if (this.id) {
    this.id = this.id.toNumber();
  }
  if (this.duration) { 
    this.duration = this.duration.toNumber();
  }

  if(myRating || myRating === 0) {
    this['my_rating'] = myRating;
  }
};