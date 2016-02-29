// extracts just the data from the query results

var _ = require('underscore');

var Actor = module.exports = function (_node) {
  _(this).extend(_node.data);
};

Actor.prototype.friends = function (friends) {
  if (friends && friends.length) {
    this.friends = friends;
  }
  return this.friends;
};