var sw = require("swagger-node-express");
var _ = require('lodash');

exports.writeResponse = function writeResponse(res, response, status) {
  sw.setHeaders(res);
  res.status(status || 200).send(JSON.stringify(response));
};

exports.writeError = function writeError(res, error, status) {
  sw.setHeaders(res);
  res.status(error.status || status || 400).send(JSON.stringify(_.omit(error, ['status'])));
};