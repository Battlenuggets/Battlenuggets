angular.module('battle', [
  'battle.services',
  'battle.auth',
  'battle.main',
  // 'ngRoute',
  'chatRoom',
  'ui.router'
])

.config(function ($stateProvider, $urlRouterProvider) {
  // $routeProvider
  // .when('/signin', {
  //   templateUrl: 'app/auth/signin.html',
  //   controller: 'AuthController'
  // })
  // .when('/signup', {
  //   templateUrl: 'app/auth/signup.html',
  //   controller: 'AuthController'
  // })
  // .when('/chat', {
  //   templateUrl: 'app/chat/chat.html'
  // })
  // .when('/', {
  //   templateUrl: 'app/main/main.html',
  //   controller: 'MainController',
  //   authenticate: true
  // })
  // .otherwise({
  //   redirectTo: '/signin'
  // });
  $urlRouterProvider.otherwise('/signin');

  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      authenticate: true
    })
    .state('main.left', {
      views: {
        'left': {
          templateUrl: 'app/chat/chat.html',
          controller: 'ChatCtrl'
        }
      }
    })
    .state('main.right', {
      views: {
        'right': {
          template: '<h3><a href="#" ui-sref="main">Change back to right side original State</a></h3>'
        }
      }
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .state('chat', {
      url: '/chat',
      templateUrl: 'app/chat/chat.html',
      controller: 'ChatCtrl'
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
