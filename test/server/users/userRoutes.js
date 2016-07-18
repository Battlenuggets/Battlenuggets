var expect = require('chai').expect;
var request = require('supertest');
var User = require('../../../src/server/users/userModel');
var app = require('../../../src/server/server');

describe('Auth API', function () {

  beforeEach(function () {
    var testUser = {
      userId: 'iamatestuser',
      password: 'supersecret',
      currency: 0
    }

    User.create(testUser);
  });

  describe('Sign-In', function () {
    it('should respond with a 404 if user not found', function() {
      var nonexistentUser = {
        username: 'billyjofosho',
        password: 'letmein'
      }

      request(app)
        .post('/api/users/signin')
        .send(nonexistentUser)
        .expect(404);
    });
  });
});