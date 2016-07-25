angular.module('betboard', ['betting'])
  .controller('BetboardCtrl', ['$scope', 'socket', function ($scope, socket) {
    $scope.bets = [];
    $scope.team0total = 0; // total amount spent on bets for team 0
    $scope.team1total = 0; // total amount spent on bets for team 1
    $scope.countdown = 0;
    $scope.started = true;

    // run on first connect to the server, sets local bets equal to the bets from the server
    socket.on('all bets', function (bets) {
      $scope.bets = bets;

      // for each bet received, add amount to the appropriate total
      bets.forEach(function (bet) {
        bet.team ? $scope.team1total += bet.amount : $scope.team0total += bet.amount;
      });
    });

    // when a bet is placed, push it to the bets array
    socket.on('placed bet', function (bet) {
      $scope.bets.push(bet);
      bet.team ? $scope.team1total += bet.amount : $scope.team0total += bet.amount; // TODO: write a function to handle total updates
      $scope.$digest();
    });

    socket.on('tick', function () {
      $scope.$apply(function () {
        $scope.started = true;
        $scope.countdown = 0;
      });
    });

    socket.on('start of battle', function () {
      $scope.$apply(function () {
        $scope.countdown = 0;
        $scope.started = true;
      });
    });

    socket.on('end of battle', function () {
      $scope.started = false;
      $scope.bets.length = 0;
      $scope.team0total = 0;
      $scope.team1total = 0;
      $scope.$digest();
    });

    socket.on('countdown', function (timeleft) {
      $scope.$apply(function () {
        $scope.started = false;
        $scope.countdown = timeleft;
      });
    });
  }]);