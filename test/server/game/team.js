var expect = require('chai').expect;
var Team = require('../../../src/server/game/team');
var Fighter = require('../../../src/server/game/fighter');

describe('Team', function () {
  var team;
  var fighters;

  beforeEach(function () {
    fighters = [
      new Fighter(),
      new Fighter(),
      new Fighter()
    ];

    team = new Team(2, fighters);
  });

  it('should have `id` and `fighters` properties', function () {
    expect(team.id).to.equal(2);
    expect(team.fighters).to.equal(fighters);
  });

  it('should add team data to its fighters on construction', function () {
    fighters.forEach(function (fighter, index) {
      expect(fighter.team.id).to.equal(team.id);
      expect(fighter.team.position).to.equal(index);
    });
  });

  it('should get a fighter by its position', function () {
    expect(team.getFighter(1)).to.equal(fighters[1]);
  });

  it('should select a fighter as a target', function () {
    var target = team.chooseTarget();

    expect(fighters.indexOf(target)).to.not.equal(-1);
  });

  it('should recognize when its fighters are all dead', function () {
    fighters.forEach(function (fighter) {
      fighter.takeDamage(fighter.health + 10);
    });

    expect(team.isDead()).to.equal(true);
  });
});
