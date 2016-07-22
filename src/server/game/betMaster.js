var user = require('../users/userModel');
var bets = [];

exports.bets = bets;
exports.placeBet = function (bet) {
  return user.placeBet(bet.id, bet.amount)
    .then(function (foundUser) {
      bet.username = foundUser.userId;
      bets.push(bet);
      return bet;
    });
};
