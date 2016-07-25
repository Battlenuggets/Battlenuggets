var _ = require('lodash');
var Battle = require('../../../src/server/game/battle');
var Team = require('../../../src/server/game/team');
var Fighter = require('../../../src/server/game/fighter');

function getMockBattle () {
  // put 8 fighters on each team. this is quite flexible
  var team0Fighters = _.range(8).map(function () {
    return new Fighter();
  });

  var team1Fighters = _.range(8).map(function () {
    return new Fighter();
  });

  var teams = [
    new Team(0, team0Fighters),
    new Team(1, team1Fighters)
  ];

  var battle = new Battle(teams);

  return {
    team0Fighters: team0Fighters,
    team1Fighters: team1Fighters,
    teams: teams,
    battle: battle
  };
}

module.exports = getMockBattle;
