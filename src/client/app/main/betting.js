angular.module('betting', [])

  .controller('BetCtrl', function ($scope, $window, Bets) {
    // all bets include auth token
    $scope.bet = {
      id: $window.localStorage.getItem('nuggets')
    };

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
  });
