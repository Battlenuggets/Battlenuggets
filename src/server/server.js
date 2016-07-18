var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var db = require('./db/db');
var path = require('path');

var app = express();
var server = require('http').createServer(app); //added for sockets
var io = require('socket.io').listen(server); //added for sockets

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../client')));
// app.use(express.static(path.join(__dirname + '/../client/chat')));

require('./routes.js')(app, express);

// start listening to requests on port 8000
var port = process.env.PORT || 8000;

// db initialization is a prereq of the app
// being launched, so we chain it up
db.sync().then(function () {
  server.listen(port);
  // app.listen(port);
  console.log('listening to 8000');
});

//listen on the connection even for incoming sockets
//possible refactor later to move into seperate file
io.sockets.on('connection', function (socket) {
  socket.on('send msg', function (data) {
    io.sockets.emit('get msg', data);
  });
});

// export our app for testing and flexibility, required by index.js
module.exports = app;
