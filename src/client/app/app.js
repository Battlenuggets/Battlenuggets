angular.module('battle', [
  'battle.services',
  'battle.auth',
  'battle.chatRoom',
  'battle.main',
  'battle.game',
  'betboard',
  'luegg.directives',
  'ngMessages',
  'ui.router',
  'ui.bootstrap'
])

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'index.html',
      views: {
        'left': {
          templateUrl: 'app/betboard/betboard.html'
        },
        'gameview': {
          templateUrl: 'app/game/game.html',
          controller: 'GameCtrl'
        },
        'right': {
          templateUrl: 'app/chat/chat.html',
          controller: 'ChatCtrl'
        }
      }
    })
    .state('main', {
      url: '/main',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      authenticate: true
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
    });

  $httpProvider.interceptors.push('AttachTokens');
})

.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('nuggets');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.run(function ($rootScope, $location, Auth, Bets, $state) {
  $rootScope.$state = $state;
  Bets.getCurrencyFromServer();
  $rootScope.$on('$stateChangeStart', function (e, next) {
    if (next.authenticate && !Auth.authed()) {
      $location.path('/signin');
    }
  });
});
