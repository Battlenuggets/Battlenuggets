var Sequelize = require('sequelize');
var db = require('../db/db');

var User = db.define('user', {
  userId: Sequelize.STRING,
  currency: Sequelize.INTEGER
}, {
  timestamps: false  // for later debate
});

module.exports = User;