var expect = require('chai').expect;
var Fighter = require('../../../src/server/game/fighter');

describe('Fighter', function () {
  var fighter;

  beforeEach(function () {
    fighter = new Fighter();
  });

  it('should initialize with default combat stats', function () {
    expect(fighter.health).to.exist;
    expect(fighter.attack).to.exist;
  });

  it('should lose and gain health', function () {
    var health = fighter.health;

    fighter.takeDamage(30);
    expect(fighter.health).to.equal(health - 30);

    fighter.takeDamage(-20);
    expect(fighter.health).to.equal(health - 10);
  });

  it('should die', function () {
    var health = fighter.health;

    expect(fighter.isDead()).to.equal(false);

    fighter.takeDamage(health);
    expect(fighter.isDead()).to.equal(true);
  });

  it('should get and set its own team data', function () {
    fighter.setTeamData(1, 4);

    expect(fighter.team.id).to.equal(1);
    expect(fighter.team.position).to.equal(4);

    expect(fighter.getTeamData()).to.deep.equal({
      id: 1,
      position: 4
    });
  });

  it('should be serializable', function () {
    var serializedFighter = fighter.serialize();

    expect(serializedFighter.combat.health).to.equal(fighter.health);
    expect(serializedFighter.combat.attack).to.equal(fighter.attack);

    // not on a team yet
    expect(serializedFighter.team.name).to.equal(null);
    expect(serializedFighter.team.position).to.equal(null);
  });
});
