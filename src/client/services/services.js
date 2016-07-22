angular.module('battle.services', [])
  .factory('Auth', function ($http, $window) {
    var signin = function (user) {
      return $http({
        method: 'POST',
        url: '/api/users/signin',
        data: user
      })
      .then(function (resp) {
        console.log('POST', resp);
        return resp;
      });
    };

    var signup = function (user) {
      return $http({
        method: 'POST',
        url: '/api/users/signup',
        data: user
      })
      .then(function (resp) {
        return resp;
      });
    };

    var authed = function () {
      return !!$window.localStorage.getItem('nuggets');
    };

    return {
      signin: signin,
      signup: signup,
      authed: authed
    };
  })
  .factory('Bets', function ($http, socket) {
    var currency;

    var getCurrencyFromServer = function () {
      return $http({
        method: 'GET',
        url: '/api/users/user'
      })
        .then(function (res) {
          currency = res.data.currency;
        });
    };

    var getCurrency = function () {
      return currency;
    };

    var placeBet = function (bet) {
      if (!bet.amount || bet.amount <= 0) {
        throw new Error('Please enter a valid bet amount');
      } else if (bet.amount > currency) {
        throw new Error('Can\'t bet more than you have!');
      } else {
        currency -= bet.amount;
        socket.emit('placing bet', bet);
      }
    };

    return {
      getCurrencyFromServer: getCurrencyFromServer,
      getCurrency: getCurrency,
      placeBet: placeBet
    };
  });
