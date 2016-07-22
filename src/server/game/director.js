var ee = require('event-emitter');

var tickEvent = 'tick';
var startOfBattleEvent = 'startOfBattle';
var endOfBattleEvent = 'endOfBattle';

// an instance of `Director` is a wrapper around a `Battle` instance,
// providing a simple API for advancing the battle and for communicating
// it to the clients.
function Director (battle, tickInterval) {
  this.setBattle(battle);
  this.setTickInterval(tickInterval);

  this.emitter = ee();
}

Director.prototype.setBattle = function (battle) {
  this.battle = battle;
};

Director.prototype.setTickInterval = function (tickInterval) {
  this.tickInterval = tickInterval;
};

// begin the `setInterval` calling `tick`, and emit `startOfBattleEvent`
Director.prototype.startBattle = function () {
  this.tickTimeout = setInterval(this.tick.bind(this), this.tickInterval);

  this.emitter.emit(startOfBattleEvent, this.serializeBattle());
};

// add a callback to be called after each tick
Director.prototype.onTick = function (callback) {
  this.emitter.on(tickEvent, callback);
};

// add a callback to be called at the start of battle
Director.prototype.onStartOfBattle = function (callback) {
  this.emitter.on(startOfBattleEvent, callback);
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

  // if the battle's over, emit `endOfBattleEvent` and stop ticking
  if (this.battle.isEnded()) {
    this.emitter.emit(endOfBattleEvent, this.battle.getEndOfBattleData());
    clearTimeout(this.tickTimeout);
  } else {
    this.emitter.emit(tickEvent, attackActions);
  }
};

// serialize the state of a battle, to be used in the initial client rendering
Director.prototype.serializeBattle = function () {
  return {
    fighters: this.battle.getSerializedFighterData()
  };
};

module.exports = Director;
