var user = require('../users/userModel');
var bets = [];
var totalBets = {
  0: 0,
  1: 0
};
exports.bets = bets;
exports.placeBet = function (bet) {
  totalBets[bet.team] += bet.amount;

  return user.placeBet(bet.id, bet.amount)
    .then(function (foundUser) {
      bet.username = foundUser.userId;
      bets.push(bet);
      return bet;
    });
};

exports.payout = function (battleResults) {
  var winningTeam = battleResults.winningTeamId;
  var winTotal = totalBets[winningTeam];
  var loseTotal = totalBets[Math.abs(winningTeam - 1)] || 1;

  if (winTotal > 0) {
    var winMult = winTotal < loseTotal ? winTotal / loseTotal : loseTotal / winTotal;

    bets.forEach(function (bet) {
      if (bet.team === winningTeam) {
        var winnings = bet.amount + Math.ceil(bet.amount * winMult);
        user.increaseCurrency(bet.id, winnings);
      }
    });
  }

  bets.length = 0;
  totalBets[0] = 0;
  totalBets[1] = 0;
};

