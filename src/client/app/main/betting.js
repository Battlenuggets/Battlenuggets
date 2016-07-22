angular.module('betting', [])

  .controller('BetCtrl', function ($scope, $window, Bets) {
    $scope.bet = {
      id: $window.localStorage.getItem('nuggets')
    };

    $scope.currency = Bets.getCurrency;

    $scope.placeBet = function () {
      try {
        Bets.placeBet($scope.bet);
        $scope.message = 'Bet placed!';
      } catch (e) {
        $scope.message = e.toString();
      }
    };
  });
