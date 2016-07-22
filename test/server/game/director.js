var _ = require('lodash');
var expect = require('chai').expect;
var Director = require('../../../src/server/game/director');
var getMockBattle = require('./mockBattle');

describe('Director', function () {
  var battle;
  var director;
  var tickInterval = 30;
  var timeBetweenBattles = 50;

  beforeEach(function () {
    battle = getMockBattle().battle;
    director = new Director(tickInterval, timeBetweenBattles, battle);
  });

  it('should tick the battle forward', function () {
    director.tick();

    // check that the attack actions were actually followed by making
    // sure that at least one of the nugs got hit by something. out of
    // sheer laziness we're just going to check that some health total
    // is non-integral
    var aNuggetWasHit = _.some(battle.getAllFighters(), function (fighter) {
      return Math.floor(fighter.health) !== fighter.health;
    });

    expect(aNuggetWasHit).to.equal(true);
  });

  it('should notify listeners on tick', function (done) {
    var battleLog = [];
    var callback = function (data) {
      battleLog.push(data);
    };

    director.onTick(callback);
    director.startBattle();

    // there should have been two ticks after `tickInterval * 2.5` ms
    setTimeout(function () {
      expect(battleLog.length).to.equal(2);

      // each entry in the log should have 6 attacks
      expect(battleLog[0].length).to.equal(6);
      expect(battleLog[1].length).to.equal(6);
      done();
    }, tickInterval * 2.5);
  });

  it('should notify listeners on the start of battle', function () {
    var called = false;
    var callback = function () {
      called = true;
    };

    director.onStartOfBattle(callback);
    director.startBattle();

    expect(called).to.equal(true);
  });

  it('should notify listeners on battle end', function (done) {
    var called = false;
    var callback = function () {
      called = true;
    };

    director.onEndOfBattle(callback);
    director.startBattle();

    // just fake it for now; this will probably break at some point
    director.battle.ended = true;

    // the battle will end after the first tick, so check after
    setTimeout(function () {
      expect(called).to.equal(true);
      done();
    }, tickInterval * 1.5);
  });

  it('should serialize its battle', function () {
    var serialized = director.serializeBattle();

    expect(serialized.fighters)
      .to.deep.equal(director.battle.getSerializedFighterData());
  });
});
