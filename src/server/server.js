var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

require('./routes.js')(app, express);

// start listening to requests on port 8000
app.listen(8000);
console.log('listening to 8000');







// export our app for testing and flexibility, required by index.js
module.exports = app;
