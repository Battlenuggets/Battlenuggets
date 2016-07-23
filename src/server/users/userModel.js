var Sequelize = require('sequelize');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
var db = require('../db/db');

var User = db.define('user', {
  userId: Sequelize.STRING,
  password: Sequelize.STRING,
  currency: Sequelize.INTEGER,
  currentIcon: Sequelize.STRING,
  ownedIcons: Sequelize.TEXT
}, {
  timestamps: false  // for later debate
});

User.hook('beforeCreate', function (user) {
  return bcrypt.hashAsync(user.password, null, null)
    .then(function (hash) {
      user.password = hash;
    });
});

User.comparePasswords = function (possPassword, currPassword) {
  return bcrypt.compareAsync(possPassword, currPassword);
};

User.signUp = function (username, password) {
  return User.findOrCreate({ where: {userId: username}, defaults: {password: password, currency: 0, ownedIcons: '[]', currentIcon: ''} })
      .spread(function (userResult, created) {
        return created;
      });
};

User.signIn = function (username, password) {
  return User.findOne({ where: {userId: username } })
    .then(function (foundUser) {
      if (!foundUser) {
        return null;
      } else {
        return User.comparePasswords(password, foundUser.password)
          .then(function (passwordMatch) {
            return passwordMatch ? foundUser : null;
          });
      }
    });
};

User.update = function (id, model) {
  return User.findById(id)
    .then(function (foundUser) {
      for (var key in model) {
        foundUser[key] = model[key];
      }
      foundUser.save();
    });
};

User.placeBet = function (id, amount) {
  return User.findById(id)
    .then(function (user) {
      if (user.currency >= amount) {
        user.currency -= amount;
        user.save();

        return user;
      }
    });
};

module.exports = User;
