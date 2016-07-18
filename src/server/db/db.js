var Sequelize = require('sequelize');
var settings = require('./settings');

var url = process.env.DATABASE_URL || settings.DBURL;

/**
 * heroku requires ssl for pg conns, so
 * if database_url is set (were on heroku)
 * we set ssl, otherwise just pass the
 * url for local repos and pg
 */
var options = process.env.DATABASE_URL ?
{
  'ssl': true,
  'dialectOptions': {
    'ssl': {
      'require': true
    }
  }
} :
{
  logging: false // logging messes up tests
};

var sequelize = new Sequelize(url, options);

module.exports = sequelize;
