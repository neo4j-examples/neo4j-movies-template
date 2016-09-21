var Genres = require("../models/genres")
  , writeResponse = require('../helpers/response').writeResponse
  , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definition:
 *   Genre:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/genres:
 *   get:
 *     tags:
 *     - genres
 *     description: Returns all genres
 *     summary: Returns all genres
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of genres
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Genre'
 */
exports.list = function (req, res, next) {
  Genres.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};