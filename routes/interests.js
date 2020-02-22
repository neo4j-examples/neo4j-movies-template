var Interests = require('../models/interests')
  , writeResponse = require('../helpers/response').writeResponse
  , writeError = require('../helpers/response').writeError
  , dbUtils = require('../neo4j/dbUtils')
  , _ = require('lodash');


/**
 * @swagger
 * definitions:
 *   interests:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       interestName:
 *         type: string
 */

/**
 * @swagger
 * /api/v0/addInterest:
 *   post:
 *     tags:
 *     - interests
 *     description: add a Node containing an interest
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         type: object
 *         schema:
 *           properties:
 *             interestName:
 *               type: string
 *             
 *     responses:
 *       201:
 *         description: Your new user
 *         schema:
 *           $ref: '#/definitions/Interest'
 *       400:
 *         description: Error message(s)
 */

exports.addInterest = function (req, res, next) {
  var interestname = _.get(req.body, 'interestName');
  var interestData = {interestname};

  if (!interestname) {
    throw {interestname: 'This field is required.', status: 400};
  }
  console.log("I'm adding an interest!");
  Interests.addInterest(dbUtils.getSession(req), interestData)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};
