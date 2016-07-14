angular.module('battle.auth', [])
  .controller('AuthController', function ($scope, Auth) {
    $scope.user = {};
    $scope.signin = Auth.signin;
  })
