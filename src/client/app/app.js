angular.module('battle', [
    'battle.auth',
    'ngRoute'
  ])
  .config(function($routeProvider) {
    $routeProvider
    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .otherwise('/signin')
  })
