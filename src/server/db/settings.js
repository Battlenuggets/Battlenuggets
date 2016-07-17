var DBNAME = 'nugget_test';
var USERNAME = 'yoozer';
var PASSWORD = 'bumblebee';
exports.DBURL = process.env.DATABASE_URL ||
  'postgres://' + USERNAME + ':' + PASSWORD + '@localhost:5432/' + DBNAME;
