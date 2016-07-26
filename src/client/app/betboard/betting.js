angular.module('betting', [])

  .controller('BetCtrl', ['$scope', '$window', 'Auth', 'socket', 'Bets', function ($scope, $window, Auth, socket, Bets) {
    // all bets include auth token
    $scope.bet = {
      id: $window.localStorage.getItem('nuggets')
    };

    $scope.authed = Auth.authed;
    $scope.betMade = false;
    $scope.started = false;

    // binds factory currency to controller/view
    $scope.currency = Bets.getCurrency;

    // attempts to place bet, otherwise displays error
    $scope.placeBet = function () {
      if (!$scope.betMade) {
        try {
          Bets.placeBet($scope.bet);
          $scope.message = 'Bet placed!';
          $scope.betMade = true;
        } catch (e) {
          $scope.message = e.toString();
        }
      }
    };

    // ensure on each tick battle started flag is set to true
    socket.on('tick', function () {
      $scope.$apply(function () {
        $scope.started = true;
      });
    });

    // ensure on start of battle battle started flag is set to true
    socket.on('start of battle', function () {
      $scope.$apply(function () {
        $scope.started = true;
      });
    });

    // on end of battle, allow betting again and get any winnings from server
    socket.on('end of battle', function () {
      $scope.started = false;
      $scope.betMade = false;
      $scope.message = '';
      Bets.getCurrencyFromServer();
    });

    // ensure while counting down started flag is set to false
    socket.on('countdown', function () {
      $scope.$apply(function () {
        $scope.started = false;
      });
    });
  }]);
