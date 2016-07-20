var _ = require('lodash');

function Team (fighters) {
  this.fighters = fighters;
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
