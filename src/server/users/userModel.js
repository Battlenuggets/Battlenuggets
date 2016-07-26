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
  timestamps: false
});

// hashes passwords before adding to the db
User.hook('beforeCreate', function (user) {
  return bcrypt.hashAsync(user.password, null, null)
    .then(function (hash) {
      user.password = hash;
    });
});

// returns a promise with the results of a password compare
User.comparePasswords = function (possPassword, currPassword) {
  return bcrypt.compareAsync(possPassword, currPassword);
};

// creates a new user if applicable with a default currency of 0 and no icons
User.signUp = function (username, password) {
  return User.findOrCreate({ where: {userId: username}, defaults: {password: password, currency: 100, ownedIcons: '[]', currentIcon: ''} })
      .spread(function (userResult, created) {
        return created;
      });
};

// compares passwords and either returns the user if password is correct, or null if incorrect
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

// updates user with given model
User.update = function (id, model) {
  return User.findById(id)
    .then(function (foundUser) {
      for (var key in model) {
        foundUser[key] = model[key];
      }
      foundUser.save();
    });
};

// reduces user currency by bet amount if amount is valid
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

// increases users currency by given amount
User.increaseCurrency = function (id, amount) {
  return User.findById(id)
    .then(function (user) {
      user.currency += amount;
      user.save();
    });
};

module.exports = User;
