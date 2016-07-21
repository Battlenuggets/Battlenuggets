var _ = require('lodash');

function Fighter (team) {
  // combat stats
  this.health = 100;
  this.attack = 10;

  // record the fighter's team
  this.team = team;
}

Fighter.prototype.getDamageRoll = function () {
  // pokemon style damage ranges
  return this.attack * _.random(0.85, 1.0);
};

Fighter.prototype.attack = function (defender) {
  var damage = this.getDamageRoll();

  defender.takeDamage(damage);
};

Fighter.prototype.takeDamage = function (damage) {
  this.health -= damage;
};

Fighter.prototype.isDead = function () {
  return this.health <= 0;
};

module.exports = Fighter;
