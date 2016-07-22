angular.module('betboard', [])
  .controller('BetboardCtrl', function ($scope, socket) {
    $scope.bets = [];
    $scope.team0total = 0;
    $scope.team1total = 0;

    socket.on('all bets', function(bets) {
      $scope.bets = bets;

      bets.forEach(function(bet) {
        bet.team === 0 ? $scope.team0total += bet.amount : $scope.team1total += bet.amount;
      });
    })

    socket.on('placed bet', function (bet) {
      $scope.bets.push(bet);
      bet.team ? $scope.team1total += bet.amount : $scope.team0total += bet.amount;
      $scope.$digest();
    });
  });
