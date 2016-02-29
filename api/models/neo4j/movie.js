// extracts just the data from the query results

var _ = require('underscore');

var Movie = module.exports = function (_node) {
  _(this).extend(_node.data);
};

Movie.prototype.genres = function (genre) {
    if (genre) {
    if (genre.name) {
      this.genre = genre;
    } else if (genre.data) {
      this.genre = _.extend(genre.data);
    }
  }
  return this.genre;
};

Movie.prototype.director = function (director) {
    if (director) {
    if (director.name) {
      this.director = director;
    } else if (director.data) {
      this.director = _.extend(director.data);
    }
  }
  return this.director;
};

Movie.prototype.writer = function (writer) {
    if (writer) {
    if (writer.name) {
      this.writer = writer;
    } else if (writer.data) {
      this.writer = _.extend(writer.data);
    }
  }
  return this.writer;
};

Movie.prototype.actors = function (actor) {
    if (actor) {
    if (actor.name) {
      this.actor = actor;
    } else if (actor.data) {
      this.actor = _.extend(actor.data);
    }
  }
  return this.actor;
};