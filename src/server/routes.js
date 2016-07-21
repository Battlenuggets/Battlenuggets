var userRoutes = require('./users/userRoutes');

module.exports = function (app, express) {
  app.post('/api/users/signin', userRoutes.signIn);
  app.post('/api/users/signup', userRoutes.signUp);
};

