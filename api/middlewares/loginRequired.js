var writeResponse = require('../helpers/writeResponse');

module.exports = function loginRequired(req, res, next) {
  var authHeader = req.headers['authorization'];
  if (!authHeader) {
    return writeResponse(res, {detail: 'no authorization provided'}, 401);
  }
  next();
};
