var Sequelize = require('sequelize');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
var db = require('../db/db');

var User = db.define('user', {
  userId: Sequelize.STRING,
  password: Sequelize.STRING,
  currency: Sequelize.INTEGER
}, {
  timestamps: false  // for later debate
});

User.hook('beforeCreate', function (user) {
  return bcrypt.hashAsync(user.password, null, null)
    .then(function (hash) {
      user.password = hash;
  });
});

User.comparePasswords = function(possPassword, currPassword) {
  return bcrypt.compareAsync(possPassword, currPassword);
};

module.exports = User;
