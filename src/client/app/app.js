angular.module('battle', [
  'battle.services',
  'battle.auth',
  'battle.main',
  'ngRoute',
  'chatRoom',
  'ui.router'
])

.config(function ($routeProvider, $stateProvider, $urlRouterProvider) {
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
  .when('/', {
    templateUrl: 'app/main/main.html',
    controller: 'MainController',
    authenticate: true
  })
  .otherwise({
    redirectTo: '/signin'
  });
})

.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shortly');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
})

.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (e, next, cur) {
    if (next.$$route && next.$$route.authenticate && !Auth.authed()) {
      $location.path('/signin');
    }
  });
});