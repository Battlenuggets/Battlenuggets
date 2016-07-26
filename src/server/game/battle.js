var _ = require('lodash');

// `teams` is an array of `Team` instances
function Battle (teams) {
  // TODO: make this an object keyed by each team's `id` field
  this.teams = teams;

  // update these when the battle's over
  this.ended = false;
  this.winningTeamId = null;
}

Battle.prototype.isEnded = function () {
  return this.ended;
};

// send this to clients at the end of a battle
Battle.prototype.getEndOfBattleData = function () {
  return {
    winningTeamId: this.winningTeamId
  };
};

// serialize each fighter in the battle
Battle.prototype.getSerializedFighterData = function () {
  var fighters = this.getAllFighters();

  return _.map(fighters, function (fighter) {
    return fighter.serialize();
  });
};

// serialize the state of a battle, to be used in the initial client rendering
Battle.prototype.serialize = function () {
  return {
    fighters: this.getSerializedFighterData()
  };
};

// returns a flat array of all fighters in the battle (not grouped by team)
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

// given an `attacker` fighter, chooses an enemy `defender` fighter and
// describes an attack by `attacker` on `defender`.
Battle.prototype.generateAttackAction = function (attacker) {
  // do nothing if the attack is dead
  if (attacker.isDead()) return null;

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
// NOTE: this mutates `attackAction`. in particular, we must add a
// `valid` property that is _truthy_ in order to have the attack
// be sent to the client by the battle director. this is quite hacky, and
// I apologize with all of my heart.
// ANOTHER NOTE: if this function returns `false`, then it halts the
// `_.each` iteration in `executeAttackActions` early. this is also somewhat
// hacky but not quite as bad.
Battle.prototype.executeAttackAction = function (attackAction) {
  // if attackAction is `null`, do nothing
  if (!attackAction) return;

  var attacker = this.getFighterFromTeamData(attackAction.attacker);

  // the attacker may have been slain during this round of attacks,
  // in which case we'd want to interrupt its impending attack
  if (attacker.isDead()) {
    attackAction.valid = false;
    return;
  }

  // past this point, the attack is valid, and we will now execute it
  attackAction.valid = true;

  var defender = this.getFighterFromTeamData(attackAction.defender);
  var defendingTeam = this.teams[defender.getTeamData().id];

  defender.takeDamage(attackAction.damage);

  // mutates an extra property onto `attackAction`
  attackAction.defenderHealth = Math.ceil(defender.health);

  // if the defending team dies here, we return `false` to stop the `_.each`
  // loop early.
  // NOTE: if we ever want to have more than 2 teams, we'd only want to
  // return false when ALL teams besides one is dead; this currently returns
  // false every time any team dies
  if (defendingTeam.isDead()) {
    this.ended = true;
    this.winningTeamId = attackAction.attacker.id;
    return false;
  }
};

// execute an array of serialized attack actions in order
Battle.prototype.executeAttackActions = function (attackActions) {
  _.each(attackActions, this.executeAttackAction.bind(this));
};

module.exports = Battle;
