var user = require('../users/userModel');

exports.placeBet = function (bet) {
  return user.placeBet(bet.id, bet.amount);
};
