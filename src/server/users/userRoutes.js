var user = require('./userModel');
var jwt = require('jwt-simple');
var secret = process.env.AUTH_SECRET || 'nuggthuggs';

module.exports = {
  signIn: function (req, res) {
    var userId = req.body.username;
    var password = req.body.password;

    user.signIn(userId, password)
      .then(function (foundUser) {
        if (!foundUser) {
          res.sendStatus(401);
        } else {
          var token = jwt.encode(foundUser, secret);
          res.json({token: token});
        }
      });
  },

  signUp: function (req, res) {
    var userId = req.body.username;
    var password = req.body.password;
    user.signUp(userId, password)
      .then(function (created) {
        res.sendStatus(created ? 201 : 401)
      });
  }
};

