var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var db = require('./db/db');
var path = require('path');
var http = require('http');

var app = express();
var server = http.createServer(app); // added for sockets
var io = require('socket.io').listen(server); // added for sockets

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../client')));

require('./routes.js')(app, express);

// start listening to requests on environment port or 8000
var port = process.env.PORT || 8000;

// db initialization is a prereq of the app
// being launched, so we chain it up
db.sync().then(function () {
  server.listen(port);
  // app.listen(port);
  console.log('listening to', port);
});

// listen on the connection even for incoming sockets
// possible refactor later to move into seperate file
io.sockets.on('connection', function (socket) {

  socket.on('send msg', function (data) {
    io.sockets.emit('get msg', data);
  });
  // added following two for tests
  socket.on('connection name', function (user) {
    io.sockets.emit('new user', user.name + ' has joined.');
  });

  socket.on('message', function(msg){
    io.sockets.emit('message', msg);
  });

});

// export our app for testing and flexibility
module.exports = app;
