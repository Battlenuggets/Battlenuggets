var Battle = require('./battle');
var Team = require('./team');
var Fighter = require('./fighter');

// eventually, would be nice to plug in `battleConfig` or something as an
// argument, so that the director can set up the `Battle` instance itself
function Director (battle) {
  this.battle = battle;
  this.round = 1;
}

Director.prototype.tick = function () {
  var attackOrder = battle.generateAttackOrder();

  // this is what we'd want to send over the socket to render
  // client-side
  var attackActions = battle.generateAttackActions(attackOrder);

  battle.executeAttackActions(attackActions);
  this.round += 1;

  return attackActions;
};

module.exports = Director;
