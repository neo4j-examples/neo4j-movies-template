// extracts just the data from the query results

const _ = require('lodash');

const Movie = module.exports = function (_node, myRating) {
  _.extend(this, _node.properties);

  this.id = this.tmdbId;
  this.poster_image = this.poster;
  this.tagline = this.plot;

  if (this.duration) { 
    this.duration = this.duration.toNumber();
  } else if (this.runtime) {
    this.duration = this.runtime.low;
  }

  if(myRating || myRating === 0) {
    this['my_rating'] = myRating;
  }
};
