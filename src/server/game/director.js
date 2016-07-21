var ee = require('event-emitter');

var tickEvent = 'tick';
var endOfBattleEvent = 'endOfBattle';

// an instance of `Director` is a wrapper around a `Battle` instance,
// providing a simple API for advancing the battle and for communicating
// it to the clients.

// eventually, would be nice to plug in `battleConfig` or something as an
// argument, so that the director can set up the `Battle` instance itself
function Director (battle, tickInterval) {
  this.battle = battle;
  this.tickInterval = tickInterval;

  this.round = 1;
  this.emitter = ee();
}

// begin the `setInterval` calling `tick`
Director.prototype.startBattle = function () {
  this.tickTimeout = setInterval(this.tick.bind(this), this.tickInterval);
};

// add a callback to be called after each tick
Director.prototype.onTick = function (callback) {
  this.emitter.on(tickEvent, callback);
};

// add a callback to be called at the end of battle
Director.prototype.onEndOfBattle = function (callback) {
  this.emitter.on(endOfBattleEvent, callback);
};

// execute a round of battle, where every nugget attacks some other one
// in a random order
Director.prototype.tick = function () {
  var attackOrder = this.battle.generateAttackOrder();

  // this is what we'd want to send over the socket to be rendered client-side
  var attackActions = this.battle.generateAttackActions(attackOrder);

  this.battle.executeAttackActions(attackActions);
  this.round += 1;

  // if the battle's over, emit `endOfBattleEvent` and stop ticking
  if (this.battle.isEnded()) {
    this.emitter.emit(endOfBattleEvent, this.battle.getEndOfBattleData());
    clearTimeout(this.tickTimeout);
  } else {
    this.emitter.emit(tickEvent, attackActions);
  }
};

module.exports = Director;
