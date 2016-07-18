angular.module('battle', [
  'battle.services',
  'battle.auth',
  'ngRoute',
  'chatRoom'
])

.config(function ($routeProvider) {
  $routeProvider
  .when('/signin', {
    templateUrl: 'app/auth/signin.html',
    controller: 'AuthController'
  })
  .when('/signup', {
    templateUrl: 'app/auth/signup.html',
    controller: 'AuthController'
  })
  .when('/chat', {
    templateUrl: 'app/chat/chat.html'
  })
  .otherwise('/signin');
});
