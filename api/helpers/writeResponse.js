var sw = require("swagger-node-express");

module.exports = function writeResponse(res, response, status) {
  sw.setHeaders(res);
  res.status(status || 200).send(JSON.stringify(response));
};
