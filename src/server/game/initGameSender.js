var Director = require('./director');
var betMaster = require('./betMaster');

function initGameSender (io) {
  this.io = io;

  // use local one for now, there's no reason to interact with it elsewhere
  var director = new Director(1000, 1000);

  // queue up the first battle
  director.queueNextBattle();

  // hook up event callbacks to send data to all connected clients
  director.onStartOfBattle(createSender(io, 'start of battle'));
  director.onTick(createSender(io, 'tick'));
  director.onEndOfBattle(betMaster.payout);
  director.onEndOfBattle(createSender(io, 'end of battle'));
}

// returns a callback function that sends `data` to all sockets
// that are connected to `io`
function createSender (io, event) {
  return function (data) {
    io.sockets.emit(event, data);
  };
}

module.exports = initGameSender;
