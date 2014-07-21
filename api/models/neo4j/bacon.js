// this bacon.js object outputs an ordered array of the bacon path between two actors

var _ = require('underscore');

var Bacon = module.exports = function (_node) {
  //console.log(_node.data);
  _(this).extend(_node.data);  //fill this out when there are more details
};