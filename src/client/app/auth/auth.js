angular.module('battle.auth', [])

.controller('AuthController', [ '$scope', '$window', '$location', 'Auth', function ($scope, $window, $location, Auth) {
  $scope.user = {};
  $scope.signinFailed;
  $scope.signupFailed;

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (response) {
        var token = response.data.token;
        if (token) {
          Auth.getUserIdFromServer();
          $window.localStorage.setItem('nuggets', token);
          $location.path('home');
        }
      })
      .catch(function (err) {
        console.log(err);
        $scope.signinFailed = 'Sign in failed try entering your your username and password again';
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function () {
        Auth.getUserIdFromServer();
        $location.path('/signin');
      })
      .catch(function (err) {
        console.log(err);
        $scope.signupFailed = 'The username has already been taken, please select with a different one';
      });
  };

  $scope.signout = function () {
    Auth.signout();
  };

  $scope.authed = function () {
    return Auth.authed();
  };
}]);
