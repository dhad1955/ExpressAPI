/**
 * A basic POC Application
 * To store objects in an in-memory database
 * @type {*|createApplication}
 */
// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
var router = express.Router();              // get an instance of the express Router

// REGISTER OUR ROUTES
require('./app/routes/json.routes.js')(app);

// START THE SERVER
app.listen(port);

console.log('Listening on port ' + port);

module.exports = app;
