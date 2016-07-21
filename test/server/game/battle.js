var _ = require('lodash');
var expect = require('chai').expect;
var Battle = require('../../../src/server/game/battle');
var Team = require('../../../src/server/game/team');
var Fighter = require('../../../src/server/game/fighter');

describe('Battle', function () {
  var battle;
  var teams;
  var team0Fighters;
  var team1Fighters;

  beforeEach(function () {
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
  });

  it('should generate a list of all fighters', function () {
    var expectedAllFighters = team0Fighters.concat(team1Fighters);

    expect(battle.getAllFighters()).to.deep.equal(expectedAllFighters);
  });

  it('should find a fighter from its team data', function () {
    var fighter = team0Fighters[2];
    var teamData = fighter.getTeamData();

    expect(battle.getFighterFromTeamData(teamData)).to.equal(fighter);
  });

  it('should choose a defender for an attack', function () {
    var attacker = team0Fighters[1];
    var defender = battle.chooseDefender(attacker);
    expect(team1Fighters.indexOf(defender)).to.not.equal(-1);

    attacker = team1Fighters[2];
    defender = battle.chooseDefender(attacker);
    expect(team0Fighters.indexOf(defender)).to.not.equal(-1);
  });

  it('should generate an order for a round of attacks', function () {
    var order = battle.generateAttackOrder();

    // expect all 6 unique fighters to be in there
    expect(order.length).to.equal(6);
    expect(_.uniq(order).length).to.equal(order.length);
  });

  it('should generate an array of attack actions', function () {
    var order = battle.generateAttackOrder();
    var actions = battle.generateAttackActions(order);

    _.each(actions, function (action, index) {
      // the attackers in `actions` should correspond, in order,
      // to the order of attacks given in `order`
      // (technically we don't need to even use deep equality here,
      // since both objects are the `team` property of the attacking fighter)
      expect(action.attacker).to.deep.equal(order[index].getTeamData());

      // the defenders should not be on the same team as the attackers
      expect(action.defender.id).to.not.equal(action.attacker.id);

      expect(action.damage).to.exist;
    });
  });

  it('should execute an attack action', function () {
    var action = {
      attacker: { id: 0, position: 1 },
      defender: { id: 1, position: 1 },
      damage: 20
    };

    var initialHealth =
      battle.getFighterFromTeamData({ id: 1, position: 1 }).health;

    battle.executeAttackAction(action);

    var finalHealth =
      battle.getFighterFromTeamData({ id: 1, position: 1 }).health;

    expect(initialHealth - 20).to.equal(finalHealth);
  });
});
