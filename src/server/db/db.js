var Sequelize = require('sequelize');

var sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: './db/database.sqlite'
});

module.exports = sequelize;