var People = require('../models/people')
  , _ = require('lodash')
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definition:
 *   Person:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       born:
 *         type: integer
 *       poster_image:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/people:
 *   get:
 *     tags:
 *     - people
 *     description: Returns all people
 *     summary: Returns all people
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of people
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Person'
 */
exports.list = function (req, res, next) {
  People.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};

/**
 * @swagger
 * /api/v0/people/bacon:
 *   get:
 *     tags:
 *     - people
 *     description: Returns all Bacon paths from person 1 to person 2
 *     summary: Returns all Bacon paths from person 1 to person 2
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name1
 *         description: Name of the origin person
 *         in: query
 *         required: true
 *         type: string
 *       - name: name2
 *         description: Name of the target person
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A list of people
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Person'
 */
exports.getBaconPeople = function (req, res, next) {
  var name1 = req.query.name1;
  var name2 = req.query.name2;

  People.getBaconPeople(dbUtils.getSession(req), req.query.name1, req.query.name2)
    .then(response => writeResponse(res, response))
    .catch(next);
};

/**
 * @swagger
 * /api/v0/people/{id}:
 *   get:
 *     tags:
 *     - people
 *     description: Returns a person by id
 *     summary: Returns a person by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Person id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A person
 *         schema:
 *           $ref: '#/definitions/Person'
 *       400:
 *         description: Error message(s)
 *       404:
 *         description: Person not found
 */
exports.findById = function (req, res, next) {
  var id = req.params.id;
  if (!id) throw {message: 'Invalid id', status: 400};

  People.getById(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
};