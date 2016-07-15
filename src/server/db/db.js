var Sequelize = require('sequelize');
var url = process.env.DATABASE_URL || 'localhost';

var sequelize = new Sequelize('d414dlcug3njlv', 'dvxtkxwgylbtrz', 'OkJpl2NmJfYhnlOSTjAepdXN29', {
  host: url,
  dialect: 'postgres'
});

module.exports = sequelize;