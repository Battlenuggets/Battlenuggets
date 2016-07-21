var _ = require('lodash');

function Team (name, fighters) {
  this.name = name;
  this.fighters = fighters;

  _.each(fighters, function (fighter, index) {
  // a fighter's `teamPosition` is their index
  // in the `fighters` array
    fighter.setTeamPosition(name, index);
  });
}

// choose a target from the team for another fighter to attack.
Team.prototype.chooseTarget = function () {
  return _.sample(this.fighters);
};

// checks if every fighter on the team is dead
Team.prototype.isDead = function () {
  return _.every(this.fighters, function (fighter) {
    return fighter.isDead();
  });
};

module.exports = Team;
