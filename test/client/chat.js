var expect = require('chai').expect;
var io = require('socket.io-client');

var socketURL = 'http://localhost:8000';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

var chatUserOne = {'name': 'Ronald'};
var chatUserTwo = {'name': 'Colonel Sanders'};

describe('Chat Server', function () {
  // Test a single user
  it('Should broadcast new user once they connect', function (done) {
    var client = io.connect(socketURL, options);

    // the general idea is to have a number of clients connect to the server
    client.on('connect', function () {
      // on connection will emit a 'connection name' event to the server, with the user data
      client.emit('connection name', chatUserOne);
    });

    client.on('new user', function (usersName) {
      // the received the connection name event and emits to all clients the new user event
      // which has the user obj and the string
      expect(usersName).to.equal(chatUserOne.name + ' has joined.');
      client.disconnect();
      done();
    });
  });

  it('Should broadcast new user to all users', function (done) {
    var clientOne = io.connect(socketURL, options);

    // here we want to connect mulitple users to the same server
    // each time a new user is connected will emit the connection name event to the server
    // and should be able to receive a response
    clientOne.on('connect', function () {
      clientOne.emit('connection name', chatUserOne);

      var clientTwo = io.connect(socketURL, options);

      clientTwo.on('connect', function () {
        clientTwo.emit('connection name', chatUserTwo);
      });

      clientTwo.on('new user', function (usersName) {
        expect(usersName).to.equal('chatUserTwo.name' + ' has joined.');
        clientTwo.disconnect();
      });
    });

    // to check the number of users that correctly connected everything there is a 'new user'
    // event received from the server increment the numUsers variable so it will total the
    // number of users connected if you make each connection event emit the connection name
    // event
    var numUsers = 0;

    clientOne.on('new user', function (usersName) {
      numUsers += 1;

      if (numUsers === 2) {
        expect(usersName).to.equal(chatUserTwo.name + ' has joined.');
        clientOne.disconnect();
        done();
      }
    });
  });

  it('Should be able to broadcast messages', function (done) {
    var clientOne;
    var clientTwo;
    var clientThree;
    var message = 'My chicken nuggets are better!';
    var messages = 0;


    // a helper function to call everything a user connects just call this function
    // to send the message event to the server
    // once the number of messages becomes three that means that those messages were
    // correctly broadcasted
    var checkMessage = function (client) {
      client.on('message', function (msg) {
        expect(message).to.equal(msg);
        client.disconnect();
        messages++;
        if (messages === 3) {
          done();
        }
      });
    };

    clientOne = io.connect(socketURL, options);
    checkMessage(clientOne);

    clientOne.on('connect', function () {
      clientTwo = io.connect(socketURL, options);
      checkMessage(clientTwo);

      clientTwo.on('connect', function () {
        clientThree = io.connect(socketURL, options);
        checkMessage(clientThree);

        clientThree.on('connect', function () {
          clientTwo.send(message);
        });
      });
    });
  });
});

