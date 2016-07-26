angular.module('battle.services', [])
  .factory('Auth', ['$http', '$window', '$location', function ($http, $window, $location) {
    var userId;
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
  }])
  .factory('Bets', ['$http', 'socket', 'Auth', function ($http, socket, Auth) {
    var currency;
    // get user's currency from server and set local currency var
    var getCurrencyFromServer = function () {
      if (Auth.authed()) {
        return $http({
          method: 'GET',
          url: '/api/users/user'
        })
          .then(function (res) {
            currency = res.data.currency;
          });
      }
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
  }])
  .factory('Store', ['$http', function ($http) {
    var getCurrencyFromServer = function () {
      return $http({
        method: 'GET',
        url: '/api/users/user'
      })
        .then(function (res) {
          return res.data.currency;
        });
    };

    var getInventoryFromServer = function () {
      return $http({
        method: 'GET',
        url: '/api/users/user'
      })
        .then(function (res) {
          return res.data.ownedIcons;
        });
    };

    var purchase = function (item) {
      return $http({
        method: 'GET',
        url: '/api/users/user'
      })
        .then(function (res) {
          var ownedIcons = JSON.parse(res.data.ownedIcons);
          ownedIcons.push(item.name);
          return $http({
            method: 'POST',
            url: '/api/users/update',
            data: {
              currency: res.data.currency - item.price,
              ownedIcons: JSON.stringify(ownedIcons)  // hahahahahahaha
            }
          });
        });
    };

    return {
      getCurrency: getCurrencyFromServer,
      getInventory: getInventoryFromServer,
      purchase: purchase
    };
  }])
  .factory('socket', function () {
    return io.connect();
  });
