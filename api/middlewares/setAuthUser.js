var writeResponse = require('../helpers/writeResponse');
var Users = require('../models/users');
var dbUtils = require('../neo4j/dbUtils');

module.exports = function setAuthUser(req, res, next) {
  var authHeader = req.headers['authorization'];
  if (!authHeader) {
    req.user = {id: null};
    next();
  }
  else {
    var match = authHeader.match(/^Token (\S+)/);
    if (!match || !match[1]) {
      return writeResponse(res, {detail: 'invalid authorization format. Follow `Token <token>`'}, 401);
    }
    var token = match[1];

    Users.me(dbUtils.getSession(req), token)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {
        writeResponse(res, err, 401);
      });
  }
};

