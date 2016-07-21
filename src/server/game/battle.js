var _ = require('lodash');

// `teams` is an array of `Team` instances
function Battle (teams) {
  this.teams = teams;
}

Battle.prototype.getAllFighters = function () {
  var fighterArrays = _.map(this.teams, 'fighters');
  return _.flatten(fighterArrays);
};

// deserialize `teamData` into the corresponding fighter
Battle.prototype.getFighterFromTeamData = function (teamData) {
  return this.teams[teamData.id].getFighter(teamData.position);
};

// chooses another fighter on a different team from `fighter`
Battle.prototype.chooseDefender = function (fighter) {
  // this is kinda lazy...
  // 1 - 0 is 1, and 1 - 1 is 0
  var enemyTeamId = 1 - fighter.team.id;

  return this.teams[enemyTeamId].chooseTarget();
};

// returns an array of all fighters in the battle, in the
// order that they should attack in the next round
Battle.prototype.generateAttackOrder = function () {
  // just randomize the list of all fighters for now. serialize
  return _.shuffle(this.getAllFighters());
};

Battle.prototype.generateAttackActions = function (attackOrder) {
  return attackOrder.map(function (attacker) {
    var defender = this.chooseDefender(attacker);

    // this is the shape of a serialized attack action
    // that we can send over the socket
    return {
      attacker: attacker.getTeamData(),
      defender: defender.getTeamData(),
      damage: attacker.getDamageRoll()
    };
  }.bind(this));
};

// execute a single serialized attack action
Battle.prototype.executeAttackAction = function (attackAction) {
  var defender = this.getFighterFromTeamData(attackAction.defender);
  defender.takeDamage(attackAction.damage);
};

// execute an array of serialized attack actions in order
Battle.prototype.executeAttackActions = function (attackActions) {
  _.each(attackActions, this.executeAttackAction.bind(this));
};

module.exports = Battle;
