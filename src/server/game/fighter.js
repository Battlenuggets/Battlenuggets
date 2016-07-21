var _ = require('lodash');

function Fighter () {
  // combat stats
  this.health = 100;
  this.attack = 10;

  // record the fighter's team and their position in the team
  this.team = {
    name: null,
    position: null
  };
}

// get a (random) damage value for the fighter to deal
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

// set a fighter's team data (called automatically when adding to a team)
Fighter.prototype.setTeamData = function (teamId, teamPosition) {
  this.team = {
    id: teamId,
    position: teamPosition
  };
};

// this can we used to serialize the fighter in the context of a
// battle, since knowing the team name and position uniquely
// determines the fighter
Fighter.prototype.getTeamData = function () {
  return this.team;
};

module.exports = Fighter;
