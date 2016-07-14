<<<<<<< d22a9f424b37e9ccf473e301b912cdf8424426d0
var userRoutes = require('./users/userRoutes')

module.exports = function (app, express) {

  app.post('/api/users/signin', userRoutes.signin);
  app.post('/api/users/signup', userRoutes.signup);
  app.get('/api/users/signedin', userRoutes.checkAuth);

};
||||||| merged common ancestors
=======
var userRoutes = require('./users/userRoutes.js');

module.exports = function (app, express) {

  app.post('/api/users/signin', userRoutes.signin);
  app.post('/api/users/signup', userRoutes.signup);
  app.get('/api/users/signedin', userRoutes.checkAuth);

};
>>>>>>> Added server stuff
