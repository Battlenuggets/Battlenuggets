var userRoutes = require('./users/userRoutes')

module.exports = function (app, express) {

  app.post('/api/users/signin', userRoutes.signin);
  app.post('/api/users/signup', userRoutes.signup);
  app.get('/api/users/signedin', userRoutes.checkAuth);

};