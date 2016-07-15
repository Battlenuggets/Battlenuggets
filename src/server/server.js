var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var db = require('./db/db');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

require('./routes.js')(app, express);

// start listening to requests on port 8000
var port = process.env.PORT || 8000;

// db initialization is a prereq of the app
// being launched, so we chain it up
db.sync().then(function () {
  app.listen(port);
  console.log('listening to 8000');
});







// export our app for testing and flexibility, required by index.js
module.exports = app;
