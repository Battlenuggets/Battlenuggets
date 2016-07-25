var _ = require('lodash');

// Essentially, just a wrapper around an array of `Fighter` objects, with
// the potential to have more helper methods for more complex battles.
function Team (id, fighters) {
  this.id = id;
  this.fighters = fighters;

  _.each(fighters, function (fighter, index) {
    // a fighter's `teamPosition` is their index in the `fighters` array
    fighter.setTeamData(id, index);
  });
}

// choose a target from the team for another fighter to attack.
// only choose from the fighters that are alive
Team.prototype.chooseTarget = function () {
  return _.sample(this.fighters.filter(function (fighter) {
    return !fighter.isDead();
  }));
};

Team.prototype.getFighter = function (position) {
  return this.fighters[position];
};

// checks if every fighter on the team is dead
Team.prototype.isDead = function () {
  return _.every(this.fighters, function (fighter) {
    return fighter.isDead();
  });
};

module.exports = Team;
