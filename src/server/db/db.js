var Sequelize = require('sequelize');

var dbname = 'daghgmnrb6tjeh';
var username = 'temhxbwqyzuvgl';
var password = 'ShZB_n-4FIZVt9SSvZ0aHix-je';
var url = process.env.DATABASE_URL ||
  `postgres://${username}:${password}@localhost:5432/${dbname}`;

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
{};

var sequelize = new Sequelize(url, options);

module.exports = sequelize;
