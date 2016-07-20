var _ = require('lodash');

function Fighter (team) {
  // each fighter should know which team they're on
  this.team = team;

  // combat stats
  this.health = 100;
  this.attack = 10;
  this.defense = 3;
  this.targets = 1;
}

Fighter.prototype.getDamageRoll = function () {
  // pokemon style damage ranges
  return this.attack * _.random(0.85, 1.0);
};

module.exports = Fighter;
