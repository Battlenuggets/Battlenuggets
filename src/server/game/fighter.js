var _ = require('lodash');

function Fighter () {
  // combat stats
  this.health = 100;
  this.attack = 10;
}

Fighter.prototype.getDamageRoll = function () {
  // pokemon style damage ranges
  return this.attack * _.random(0.85, 1.0);
};

Fighter.prototype.takeDamage = function (damage) {
  this.health -= damage;
};

Fighter.prototype.isDead = function () {
  return this.health <= 0;
};

module.exports = Fighter;
