var _ = require('lodash');

// `teams` is an array of `Team` instances
function Battle (teams) {
  // TODO: make this an object keyed by each team's `id` field
  this.teams = teams;

  // set this to true when the battle's over
  this.ended = false;
}

Battle.prototype.isEnded = function () {
  return this.ended;
};

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

Battle.prototype.generateAttackAction = function (attacker) {
  var defender = this.chooseDefender(attacker);

  // this is the shape of a serialized attack action
  // that we can send over the socket
  return {
    attacker: attacker.getTeamData(),
    defender: defender.getTeamData(),
    damage: attacker.getDamageRoll()
  };
};

Battle.prototype.generateAttackActions = function (attackOrder) {
  return attackOrder.map(this.generateAttackAction.bind(this));
};

// execute a single serialized attack action
Battle.prototype.executeAttackAction = function (attackAction) {
  var defender = this.getFighterFromTeamData(attackAction.defender);
  var defendingTeam = this.teams[defender.getTeamData().id];

  defender.takeDamage(attackAction.damage);

  // if the defending team dies here, we return `false` to stop the `_.each`
  // loop early.
  // TODO: if we ever want to have more than 2 teams, we'd only want to
  // return false when ALL teams besides one is dead; this would return
  // false every time any team dies
  if (defendingTeam.isDead()) {
    this.ended = true;
    return false;
  }
};

// execute an array of serialized attack actions in order
Battle.prototype.executeAttackActions = function (attackActions) {
  _.each(attackActions, this.executeAttackAction.bind(this));
};

module.exports = Battle;
