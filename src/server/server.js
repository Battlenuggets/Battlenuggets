var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var db = require('./db/db');
var path = require('path');
var http = require('http');
var jwt = require('jwt-simple');
var betMaster = require('./game/betMaster');
var secret = process.env.AUTH_SECRET || 'nuggthuggs'; // TODO: refactor to shared server config

var app = express();
var server = http.createServer(app); // added for sockets
var io = require('socket.io').listen(server); // added for sockets

// send game state data to clients through the socket server
require('./game/initGameSender')(io);

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
  socket.emit('all bets', betMaster.bets);

  socket.on('send msg', function (data) {
    io.sockets.emit('get msg', data);
  });
  // added following two for tests
  socket.on('connection name', function (user) {
    io.sockets.emit('new user', user.name + ' has joined.');
  });

  socket.on('message', function (msg) {
    io.sockets.emit('message', msg);
  });

  socket.on('placing bet', function (data) {
    // get id from token in bet
    data.id = jwt.decode(data.id, secret).id;

    // attempt to place bet and emit it to all clients when done
    betMaster.placeBet(data)
      .then(function (completedBet) {
        io.sockets.emit('placed bet', completedBet);
      });
  });
});

// export our app for testing and flexibility
module.exports = app;
