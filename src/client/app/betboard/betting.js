angular.module('betting', [])

  .controller('BetCtrl', ['$scope', '$window', 'Auth', 'socket', 'Bets', function ($scope, $window, Auth, socket, Bets) {
    // all bets include auth token
    $scope.bet = {
      id: $window.localStorage.getItem('nuggets')
    };

    if (Auth.authed()) {
      Bets.getCurrencyFromServer();
    }

    // binds factory currency to controller/view
    $scope.currency = Bets.getCurrency;

    // attempts to place bet, otherwise displays error
    $scope.placeBet = function () {
      try {
        Bets.placeBet($scope.bet);
        $scope.message = 'Bet placed!';
      } catch (e) {
        $scope.message = e.toString();
      }
    };

    socket.on('end of battle', function () {
      Bets.getCurrencyFromServer();
    });
  }]);
