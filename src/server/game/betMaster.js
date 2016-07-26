var user = require('../users/userModel');
var bets = []; // all bets for current match
var totalBets = { // total amount bet on each team
  0: 0,
  1: 0
};
exports.bets = bets;

// handles placement of bets
exports.placeBet = function (bet) {
  // add bet amount to that teams total
  totalBets[bet.team] += bet.amount;

  // subtract the bet amount from user's currency
  return user.placeBet(bet.id, bet.amount)
    // then add the username for the socket response and push the bet to all bets array
    .then(function (foundUser) {
      bet.username = foundUser.userId;
      bets.push(bet);
      return bet;
    });
};

// calculates all payouts and updates database with winnings
exports.payout = function (battleResults) {
  var winningTeam = battleResults.winningTeamId;

  // total amount of bets on team that won
  var winTotal = totalBets[winningTeam];

  // total amount of bets on team that lost. if no bets were placed on team
  // uses Math.abs to find the losing team. if team 1 wins, Math.abs(1-1) = 0, if team 0 wins Math.abs(0-1) = 1
  // if no bets were placed on losing team, set loseTotal to 1 to avoid division by 0
  var loseTotal = totalBets[Math.abs(winningTeam - 1)] || 1;

  // if anyone bet on the winning team
  if (winTotal > 0) {
    // calculate the ratio for winnings
    var winMult = winTotal < loseTotal ? winTotal / loseTotal : loseTotal / winTotal;

    // for each bet placed on the winning team, calculate winnings and update the database
    bets.forEach(function (bet) {
      if (bet.team === winningTeam) {
        var winnings = bet.amount + Math.ceil(bet.amount * winMult);
        user.increaseCurrency(bet.id, winnings);
      }
    });
  }

  // once paid out, reset the bets array and totals for each team
  bets.length = 0;
  totalBets[0] = 0;
  totalBets[1] = 0;
};

