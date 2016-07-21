var _ = require('lodash');
var expect = require('chai').expect;
var Director = require('../../../src/server/game/director');
var getMockBattle = require('./mockBattle');

describe('Director', function () {
  var battle;
  var director;

  beforeEach(function () {
    battle = getMockBattle().battle;
    director = new Director(battle);
  });

  it('should tick the battle forward', function () {
    director.tick();

    // increment the round after a tick
    expect(director.round).to.equal(2);

    // check that the attack actions were actually followed by making
    // sure that at least one of the nugs got hit by something. out of
    // sheer laziness we're just going to check that some health total
    // is non-integral
    var aNuggetWasHit = _.some(battle.getAllFighters(), function (fighter) {
      return Math.floor(fighter.health) !== fighter.health;
    });

    expect(aNuggetWasHit).to.equal(true);
  });
});
