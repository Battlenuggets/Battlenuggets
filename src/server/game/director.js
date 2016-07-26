var _ = require('lodash');
var ee = require('event-emitter');
var getMockBattle = require('./newBattle');

// event name constants
var tickEvent = 'tick';
var startOfBattleEvent = 'startOfBattle';
var endOfBattleEvent = 'endOfBattle';

// the `Director` is responsible for updating and creating new `Battle`
// instances. it has an event emitter, `this.emitter`, that emits
// events when the current battle starts, ticks, and ends, and exposes
// methods to register callbacks to each of those event types:
// `onStartOfBattle`, `onTick`, and `onEndOfBattle`.
function Director (tickInterval, timeBetweenBattles, battle) {
  this.tickInterval = tickInterval;
  this.timeBetweenBattles = timeBetweenBattles;
  this.battle = battle;
  this.countdownInterval;

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
  clearInterval(this.countdownInterval);
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

// begin the `setInterval` calling `tick`, and emit `startOfBattleEvent`
Director.prototype.startBattle = function () {
  this.tickTimeout = setInterval(this.tick.bind(this), this.tickInterval);

  // emit the initial state of the battle when it starts
  this.emitter.emit(startOfBattleEvent, this.battle.serialize());
};

Director.prototype.startCountdown = function (io) {
  // in between battle countdown
  var countdown = 14;
  this.countdownInterval = setInterval(function () {
    io.sockets.emit('countdown', countdown);
    countdown--;
  }, 1000);
};

Director.prototype.stopCountdown = function () {
  clearInterval(this.countdownInterval);
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
  // generate a random attack order
  var attackOrder = this.battle.generateAttackOrder();
  var attackActions = this.battle.generateAttackActions(attackOrder);

  this.battle.executeAttackActions(attackActions);

  // filter out `null` actions and actions where `valid` is false
  var validAttackActions = _.filter(attackActions, function (action) {
    return action && action.valid;
  });

  this.emitter.emit(tickEvent, validAttackActions);

  // if the battle's over, emit `endOfBattleEvent` and stop ticking
  if (this.battle.isEnded()) {
    this.emitter.emit(endOfBattleEvent, this.battle.getEndOfBattleData());
    clearTimeout(this.tickTimeout);
  }
};

module.exports = Director;
