
// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

let redis = require('redis');

global.client = redis.createClient(6379, process.env.NODE_ENV == 'test' ? 'localhost' : 'redis');

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
var router = express.Router();              // get an instance of the express Router

// REGISTER OUR ROUTES
require('./app/routes/objects.routes.js')(app);

// START THE SERVER
app.listen(port);

console.log('Listening on port ' + port);

module.exports = app;
