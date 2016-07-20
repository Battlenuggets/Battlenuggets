angular.module('battle.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (response) {
        var token = response.data.token;
        if (token) {
          $window.localStorage.setItem('nuggets', token);
          $location.path('/');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function () {
        $location.path('/signin');
      })
      .catch(function (err) {
        console.log(err);
      });
  };
});
