var Sequelize = require('sequelize');

var url = process.env.DATABASE_URL || 
  'postgres://temhxbwqyzuvgl:ShZB_n-4FIZVt9SSvZ0aHix-je@ec2-107-22-235-119.compute-1.amazonaws.com:5432/daghgmnrb6tjeh';

var sequelize = new Sequelize(url, {
  'ssl': true,
  'dialectOptions': {
    'ssl': {
      'require': true
    }
  }
});

module.exports = sequelize;