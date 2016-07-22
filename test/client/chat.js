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

    client.on('connect', function () {
      client.emit('connection name', chatUserOne);
    });

    client.on('new user', function (usersName) {
      expect(usersName).to.equal(chatUserOne.name + ' has joined.');
      client.disconnect();
      done();
    });
  });

  it('Should broadcast new user to all users', function (done) {
    var clientOne = io.connect(socketURL, options);

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

