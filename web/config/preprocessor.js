'use strict';

var ReactTools = require('react-tools');

/**
 * Preprocess tests files containing jsx code and allow es6 in unit tests.
 */
module.exports = {
  process: function(src, path) {
    return ReactTools.transform(src, {harmony: true});
  }
};
