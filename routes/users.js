// movies.js
var Users = require('../models/users')
  , writeResponse = require('../helpers/response').writeResponse
  , writeError = require('../helpers/response').writeError
  , dbUtils = require('../neo4j/dbUtils')
  , _ = require('lodash');

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       first_name:
 *         type: string
 *       last_name:
 *         type: string
 *       username:
 *         type: string
 *       avatar:
 *         type: object
 */

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     tags:
 *     - users
 *     description: Register a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         type: object
 *         schema:
 *           properties:
 *             username:
 *               type: string
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *     responses:
 *       201:
 *         description: Your new user
 *         schema:
 *           $ref: '#/definitions/User'
 *       400:
 *         description: Error message(s)
 */
exports.register = function (req, res, next) {
  var username = _.get(req.body, 'username');
  var firstName = _.get(req.body, 'first_name');
  var lastName = _.get(req.body, 'last_name');

  var userData = { username, firstName, lastName };

  if (!username) {
    throw { username: 'This field is required.', status: 400 };
  }

  Users.register(dbUtils.getSession(req), userData)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};


/**
 * @swagger
 * /api/v1/register/bulk:
 *   post:
 *     tags:
 *     - users
 *     description: Register new users in bulk
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         type: object
 *         schema:
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 *     responses:
 *       201:
 *         description: Your new user
 *         schema:
 *           type: array
 *           items:
 *              $ref: '#/definitions/User'
 *       400:
 *         description: Error message(s)
 */
exports.registerBulk = function (req, res, next) {
  var users = _.get(req.body, 'users');

  if (!users) {
    throw { username: 'This field is required.', status: 400 };
  }

  Users.registerBulk(dbUtils.getSession(req), users)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};


