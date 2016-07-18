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
  });
});