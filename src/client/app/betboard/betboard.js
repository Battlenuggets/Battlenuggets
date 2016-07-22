angular.module('betboard', [])
  .controller('BetboardCtrl', function ($scope, socket) {
    $scope.bets = [];
    $scope.team0total = 0; // total amount spent on bets for team 0
    $scope.team1total = 0; // total amount spent on bets for team 1

    // run on first connect to the server, sets local bets equal to the bets from the server
    socket.on('all bets', function(bets) {
      $scope.bets = bets;

      // for each bet received, add amount to the appropriate total
      bets.forEach(function(bet) {
        bet.team ? $scope.team1total += bet.amount : $scope.team0total += bet.amount;
      });
    })

    // when a bet is placed, push it to the bets array
    socket.on('placed bet', function (bet) {
      $scope.bets.push(bet);
      bet.team ? $scope.team1total += bet.amount : $scope.team0total += bet.amount; // TODO: write a function to handle total updates
      $scope.$digest();
    });
  });
