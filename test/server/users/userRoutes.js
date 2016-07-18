var expect = require('chai').expect;
var request = require('supertest');
var User = require('../../../src/server/users/userModel');
var app = require('../../../src/server/server');

var testUser = {
  userId: 'iamatestuser',
  password: 'supersecret',
  currency: 0
}

describe('Auth API', function () {

  beforeEach(function () {
    User.create(testUser);
  });

  describe('Sign-In', function () {
    it('should respond with a 404 if user not found', function(done) {
      var nonexistentUser = {
        username: 'billyjofosho',
        password: 'letmein'
      }

      request(app)
        .post('/api/users/signin')
        .send(nonexistentUser)
        .expect(404, done);
    });

    it('should respond with a 401 if wrong password is used', function(done) {
      var wrongPassword = {
        username: 'iamatestuser',
        password: 'badPassword',
      }

      request(app)
        .post('/api/users/signin')
        .send(wrongPassword)
        .expect(401, done);
    });

    it('should respond with a token if user exists and password is correct', function(done) {
      var user = {
        username: testUser.userId,
        password: testUser.password
      }

      request(app)
        .post('/api/users/signin')
        .send(user)
        .then(function(res) {
          expect(res.body.token).to.exist;
          done();
        });
    });
  });

  describe('Sign-up', function () {
    it('should respond with a 401 if user already exists', function(done) {
      var user = {
        username: testUser.userId,
        password: testUser.password
      }

      request(app)
        .post('/api/users/signup')
        .send(user)
        .expect(401, done);
    })
  });

  it('should respond with a token if user is nonexistent', function(done) {
      var user = {
        username: 'totallynewuser',
        password: 'sickpasswordbro'
      }

      request(app)
        .post('/api/users/signup')
        .send(user)
        .then(function(res) {
          expect(res.body.token).to.exist;
          done();
        });
    });
});