var express = require('express');
var app = express();
app.use(express.logger());

// var http_handler = express.static(__dirname + '/');

app.configure(function(){
  app.use('/dist/assets', express.static(__dirname + '/dist/assets'));
  app.use(express.static(__dirname + '/dist'));
});

// app.get('/', function(req, res, next) {
//   // if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
//   //   res.writeHead(302, { 'Location' : req.url + '/' });
//   //   res.end();
//   //   return;
//   // }
//   // take off leading /docs so that connect locates file correctly
//   // req.url = req.url.substr('/docs'.length);
//   return http_handler(req, res, next);
// });

// // redirect to /docs
// app.get('/', function(req, res) {
//   res.redirect('./docs');
// });


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});