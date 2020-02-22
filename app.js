var express = require('express')
  , path = require('path')
  , routes = require('./routes')
  , nconf = require('./config')
  , swaggerJSDoc = require('swagger-jsdoc')
  , methodOverride = require('method-override')
  , errorHandler = require('errorhandler')
  , bodyParser = require('body-parser')
  // , setAuthUser = require('./middlewares/setAuthUser')
  , neo4jSessionCleanup = require('./middlewares/neo4jSessionCleanup')
  , writeError = require('./helpers/response').writeError;

var app = express()
  , api = express();

app.use(nconf.get('api_path'), api);

/* -- -- SWAGGER -- -- */
var swaggerDefinition = {
  info: {
    title: 'Neo4j Movie Demo API (Node/Express)',
    version: '1.0.0',
    description: '',
  },
  host: 'localhost:3000',
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve swagger
api.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/docs', express.static(path.join(__dirname, 'swaggerui')));
app.set('port', nconf.get('PORT'));

api.use(bodyParser.json());
api.use(methodOverride());

//enable CORS
api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//api custom middlewares:
// api.use(setAuthUser);
api.use(neo4jSessionCleanup);

//api routes
api.post('/register', routes.users.register);
api.post('/addInterest', routes.interests.addInterest);
api.post('/addInterest/bulk', routes.interests.addInterestBulk);
api.post('/getUsersInterestedIn', routes.interests.getUsersInterestedIn);
// api.post('/connectUserToExistingInterest', routes.interests.connectUserToInterest);
api.post('/register/bulk', routes.users.registerBulk);
api.get('/organizations', routes.organizations.list);
api.post('/organizations', routes.organizations.create);
api.post('/delete', routes.admin.deleteData);
api.post('/dummyData', routes.admin.createDummyData);
api.post('/slack', routes.slack.receive);

// api.get('/movies/:id',  routes.movies.findById);


//api error handler
api.use(function(err, req, res, next) {
  if(err && err.status) {
    writeError(res, err);
  }
  else next(err);
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port') + ' see docs at /docs');
});