angular.module('betting', [])

  .controller('BetCtrl', ['$scope', '$window', 'Auth', 'socket', 'Bets', function ($scope, $window, Auth, socket, Bets) {
    // all bets include auth token
    $scope.bet = {
      id: $window.localStorage.getItem('nuggets')
    };

    $scope.authed = Auth.authed;
    $scope.betMade = false;
    $scope.started = false;

    if (Auth.authed()) {
      Bets.getCurrencyFromServer();
    }

    // binds factory currency to controller/view
    $scope.currency = Bets.getCurrency;

    // attempts to place bet, otherwise displays error
    $scope.placeBet = function () {
      if (!$scope.betMade) {
        try {
          if (Auth.authed()) {
            Bets.placeBet($scope.bet);
            $scope.message = 'Bet placed!';
          }
          $scope.betMade = true;
        } catch (e) {
          $scope.message = e.toString();
        }
      }
    };

    socket.on('tick', function () {
      $scope.$apply(function () {
        $scope.started = true;
      });
    });

    socket.on('start of battle', function () {
      $scope.$apply(function () {
        $scope.started = true;
      });
    });

    socket.on('end of battle', function () {
      $scope.started = false;
      $scope.betMade = false;
      $scope.message = '';
      Bets.getCurrencyFromServer();
    });

    socket.on('countdown', function () {
      $scope.$apply(function () {
        $scope.started = false;
      });
    });
  }]);