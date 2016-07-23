var userRoutes = require('./users/userRoutes');

module.exports = function (app, express) {
  app.post('/api/users/signin', userRoutes.signIn);
  app.post('/api/users/signup', userRoutes.signUp);
  app.get('/api/users/user', userRoutes.findUser);
  app.post('/api/users/update', userRoutes.updateUser);
};
