var Sequelize = require('sequelize');

var url = process.env.DATABASE_URL || 'localhost';
var dbname = 'd414dlcug3njlv';
var username = 'dvxtkxwgylbtrz';
var password = 'OkJpl2NmJfYhnlOSTjAepdXN29';

var sequelize = new Sequelize(dbname, username, password, {
  host: url,
  dialect: 'postgres'
});

module.exports = sequelize;