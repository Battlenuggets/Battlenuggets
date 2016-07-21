var Battle = require('../../../src/server/game/battle');
var Team = require('../../../src/server/game/team');
var Fighter = require('../../../src/server/game/fighter');

function getMockBattle () {
  team0Fighters = [
    new Fighter(),
    new Fighter(),
    new Fighter()
  ];

  team1Fighters = [
    new Fighter(),
    new Fighter(),
    new Fighter()
  ];

  teams = [
    new Team(0, team0Fighters),
    new Team(1, team1Fighters)
  ];

  battle = new Battle(teams);

  return {
    team0Fighters: team0Fighters,
    team1Fighters: team1Fighters,
    teams: teams,
    battle: battle
  };
}

module.exports = getMockBattle;
