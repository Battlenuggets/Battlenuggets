angular.module('battle.services', [])
  .factory('Auth', function ($http, $window, $location) {
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

    var signout = function () {
      $window.localStorage.removeItem('nuggets');
      $location.path('/signin');
    };

    return {
      signin: signin,
      signup: signup,
      authed: authed,
      signout: signout
    };
  })
  .factory('Bets', function ($http, socket) {
    var currency;

    // get user's currency from server and set local currency var
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
      if (!bet.amount || bet.amount <= 0) { // if bet is null or not a valid number, throw error
        throw new Error('Please enter a valid bet amount');
      } else if (bet.amount > currency) { // if bet is greater than the currency user has, throw error
        throw new Error('Can\'t bet more than you have!');
      } else { // otherwise, subtract the bet amount from currency and emit bet
        currency -= bet.amount;
        socket.emit('placing bet', bet);
      }
    };

    return {
      getCurrencyFromServer: getCurrencyFromServer,
      getCurrency: getCurrency,
      placeBet: placeBet
    };
  })
  .factory('Store', function ($http) {
    return {};
  });
