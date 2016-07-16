angular.module('battle.auth', [])
  .controller('AuthController', function ($scope, Auth) {
    $scope.user = {};
    $scope.signin = function() {
      Auth.signin($scope.user);
    }
    $scope.signup = function() {
      Auth.signup($scope.user);
    }
  })
