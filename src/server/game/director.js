var ee = require('event-emitter');

var tickEvent = 'tick';
var endOfBattleEvent = 'endOfBattle';

// eventually, would be nice to plug in `battleConfig` or something as an
// argument, so that the director can set up the `Battle` instance itself
function Director (battle, tickInterval) {
  this.battle = battle;
  this.tickInterval = tickInterval;

  this.round = 1;
  this.emitter = ee();
}

Director.prototype.startBattle = function () {
  this.tickTimeout = setInterval(this.tick.bind(this), this.tickInterval);
};

Director.prototype.onTick = function (callback) {
  this.emitter.on(tickEvent, callback);
};

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
