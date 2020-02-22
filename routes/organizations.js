var Organizations = require("../models/organizations")
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils')
  , _ = require('lodash');

/**
 * @swagger
 * definitions:
 *   Organization:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 */

/**
 * @swagger
 * /api/v1/organizations:
 *   get:
 *     tags:
 *     - organizations
 *     description: Returns all organizations
 *     summary: Returns all organizations
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of organizations
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Organization'
 */
exports.list = function (req, res, next) {
  Organizations.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};

/**
 * @swagger
 * /api/v1/organizations:
 *   post:
 *     tags:
 *     - organizations
 *     description: Register a new organization
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         type: object
 *         schema:
 *           properties:
 *             name:
 *               type: string
 *     responses:
 *       201:
 *         description: Your new organization
 *         schema:
 *           $ref: '#/definitions/organization'
 *       400:
 *         description: Error message(s)
 */
exports.create = function (req, res, next) {
  var name = _.get(req.body, 'name');

  if (!name) {
    throw {name: 'This field is required.', status: 400};
  }

  Organizations.create(dbUtils.getSession(req), name)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};