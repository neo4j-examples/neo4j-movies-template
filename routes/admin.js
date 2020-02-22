var Interests = require('../models/interests')
  , Admin = require('../services/admin')
  , writeResponse = require('../helpers/response').writeResponse
  , writeError = require('../helpers/response').writeError
  , dbUtils = require('../neo4j/dbUtils')
  , _ = require('lodash');

/**
 * @swagger
 * /api/v1/delete:
 *   post:
 *     tags:
 *     - admin
 *     description: delete all items in the DB
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         type: object
 *         schema:
 *           properties:
 *            
 *     responses:
 *       201:
 *         description: Your new user
 *         schema:
 *           type: array
 *           items:
 *              $ref: '#/definitions/admin'
 *       400:
 *         description: Error message(s)
 */

exports.deleteData = function (req, res, next) { // delete
  
    Admin.deleteData(dbUtils.getSession(req))
      .then(response => writeResponse(res, response, 201))
      .catch(next);
  };

exports.createDummyData = function (req, res, next){

};

// createDummyData