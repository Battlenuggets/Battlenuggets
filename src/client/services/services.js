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

