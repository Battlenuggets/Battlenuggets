var user = require('./userModel');
var jwt = require('jwt-simple');
var secret = process.env.AUTH_SECRET || 'nuggthuggs';

module.exports = {
  signin: function (req, res) {
    var userId = req.body.username;
    var password = req.body.password;

    user.findOne({ where: {userId: userId } })
      .then(function (foundUser) {
        if (!foundUser) {
          res.sendStatus(404);
        } else {
          user.comparePasswords(password, foundUser.password)
            .then(function (passwordMatch) {
              if (passwordMatch) {
                var token = jwt.encode(foundUser, secret);
                res.json({token: token});
              } else {
                res.sendStatus(401);
              }
            });
        }
      });
  },
  signup: function (req, res) {
    var userId = req.body.username;
    var password = req.body.password;

    user.findOrCreate({ where: {userId: userId}, defaults: {password: password, currency: 0} })
      .spread(function (userResult, created) {
        if (created) {
          var token = jwt.encode(userResult, secret);
          res.json({token: token});
        } else {
          res.sendStatus(401);
        }
      });
  },
  checkAuth: function (req, res) {
    res.send('hi');
  }
};

