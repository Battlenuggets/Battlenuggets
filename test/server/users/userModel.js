var User = require('../../../src/server/users/userModel');
var expect = require('chai').expect;
var pgp = require('pg-promise')();
var settings = require('../../../src/server/db/settings');

describe('User table', function () {
  var db;

  before(function () {
    return User.sync()
      .then(function () {
        // hooray
      });
  });

  beforeEach(function () {
    var url = settings.DBURL;
    db = pgp(url);

    // get rid of all bacon oriented fake data
    // before each test. also run a user sync
    // before anything executes.
    return db.query('delete from $1~ where $2~ like $3', [
      'users',
      'userId',
      'bacon%'
    ])
    .then(function () {
      // hooray
    });
  });

  it('should add a user', function () {
    // use the ORM to create something and validate
    // its success by using 'raw' pg queries (sorta)
    return User.create({
      userId: 'bacon sandwich',
      currency: 15
    })
    .then(function () {
      return db.query('select * from $1~ where $2~=$3', [
        'users',
        'userId',
        'bacon sandwich'
      ]);
    })
    .then(function (result) {
      expect(result.length).to.not.equal(0);
    });
  });

  it('should fetch an existing user', function () {
    // flip it - use direct queries to insert
    // use the ORM to fetch it out again
    return db.query('insert into $1~ ($2~, $3~) values ($4, $5)', [
      'users',
      'userId',
      'currency',
      'bacon sandwich',
      22
    ])
    .then(function () {
      return User.findOne({
        where: {
          userId: 'bacon sandwich',
          currency: 22
        }
      });
    })
    .then(function (result) {
      expect(result).to.not.be.null;
    });
  });

  it('should fail to fetch a nonexistent user', function () {
    return User.findOne({
      where: {
        userId: 'nugget hater'
      }
    })
    .then(function (result) {
      expect(result).to.be.null;
    });
  });
});
