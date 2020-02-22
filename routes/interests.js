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
 * /api/v1/addInterest:
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
 *             username:
 *               type: string
 *             interestname:
 *               type: string
 *             
 *     responses:
 *       201:
 *         description: Add your new interest
 *         schema:
 *           $ref: '#/definitions/Interest'
 *       400:
 *         description: Error message(s)
 */

exports.addInterest = function (req, res, next) {
  var interestname = _.get(req.body, 'interestname');
  var interestData = {interestname};
  var username = _.get(req.body, 'username');
  var userData = {username};

  if (!interestname) {
    throw {interestname: 'This field is required.', status: 400};
  }
  if (!username) {
    throw {username: 'This field is required.', status: 400};
  }
  // console.log("I'm adding an interest!");
  Interests.addInterest(dbUtils.getSession(req), interestData, userData)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};


/**
 * @swagger
 * /api/v1/connectUserToExistingInterest:
 *   post:
 *     tags:
 *     - interests
 *     - users
 *     description: add a connection between a user node and an interest node
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
 *             interestname:
 *               type: string
 * 
 *     responses:
 *       201:
 *         description: Your new connection
 *         schema:
 *           $ref: '#/definitions/Connection'
 *       400:
 *         description: Error message(s)
 */
exports.connectUserToInterest = function (req, res, next){
  var interestname = _.get(req.body, 'interestname');
  var interestData = {interestname};
  var username = _.get(req.body, 'username');
  var userData = {username};

  if(!interestname){
    throw{interestname: 'This field is required.', status: 400};
  }
  if(!username){
    throw{username: 'This field is required.', status: 400};
  }
  Interests.connectUserToInterest(dbUtils.getSession(req), userData, interestData)
    .then(response => writeResponse(res, response, 201))
    .catch(next);  
}
