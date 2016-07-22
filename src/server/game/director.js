var ee = require('event-emitter');

// TODO: should probably not rely on this
var getMockBattle = require('../../../test/server/game/mockBattle');

// event name constants
var tickEvent = 'tick';
var startOfBattleEvent = 'startOfBattle';
var endOfBattleEvent = 'endOfBattle';

// an instance of `Director` is a wrapper around a `Battle` instance,
// providing a simple API for advancing the battle and for communicating
// it to the clients.
function Director (tickInterval, timeBetweenBattles, battle) {
  this.tickInterval = tickInterval;
  this.timeBetweenBattles = timeBetweenBattles;
  this.battle = battle;

  this.emitter = ee();

  // queue the next battle when the last one ends
  this.onEndOfBattle(this.queueNextBattle.bind(this));
}

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

// create a new battle to feed to the director
Director.prototype.getNewBattle = function () {
  return getMockBattle().battle;
};

// serialize the state of a battle, to be used in the initial client rendering
Director.prototype.serializeBattle = function () {
  return {
    fighters: this.battle.getSerializedFighterData()
  };
};

// begin the `setInterval` calling `tick`, and emit `startOfBattleEvent`
Director.prototype.startBattle = function () {
  this.tickTimeout = setInterval(this.tick.bind(this), this.tickInterval);

  // emit the initial state of the battle when it starts
  this.emitter.emit(startOfBattleEvent, this.serializeBattle());
};

// wait `timeBetweenBattles` ms, then create and start a new battle
Director.prototype.queueNextBattle = function () {
  setTimeout(function () {
    var nextBattle = this.getNewBattle();
    this.battle = nextBattle;
    this.startBattle();
  }.bind(this), this.timeBetweenBattles);
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

module.exports = Director;
