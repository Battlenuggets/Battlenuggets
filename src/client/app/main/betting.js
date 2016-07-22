angular.module('betting', [])

  .controller('BetCtrl', function ($scope, $window, Bets) {
    $scope.currency = Bets.getCurrency;
  });
