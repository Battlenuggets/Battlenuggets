exports.DBNAME = 'nugget_test';
exports.USERNAME = 'yoozer';
exports.PASSWORD = 'bumblebee';
exports.DBURL = process.env.DATABASE_URL ||
  `postgres://${exports.USERNAME}:${exports.PASSWORD}@localhost:5432/${exports.DBNAME}`;
