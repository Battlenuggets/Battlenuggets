angular.module('battle.game', [])
  .factory('gameListeners', function () {
    var startOfBattleEvent = 'start of battle';
    var tickEvent = 'tick';
    var endOfBattleEvent = 'end of battle';

    return {
      remove: function (socket) {
        socket.removeAllListeners(startOfBattleEvent);
        socket.removeAllListeners(tickEvent);
        socket.removeAllListeners(endOfBattleEvent);
      },

      add: function (socket, renderer) {
        // remove the existing listeners on the gamestate events so
        // that we don't have duplicate listeners
        this.remove(socket);

        socket.on(startOfBattleEvent, renderer.onStartOfBattle);
        socket.on(tickEvent, renderer.onTick);
        socket.on(endOfBattleEvent, renderer.onEndOfBattle);
      }
    };
  })
  .factory('renderer', function () {
    var gameview = document.getElementsByClassName('gameview')[0];
    var canvas = document.getElementById('canvas');

    // TODO: either make entire page statically sized, or somehow add
    // resize handlers to this
    var width = canvas.width = 500;
    var height = canvas.height = 500;

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    return {
      start: function () {
        // create a new game object here, and start up the game loop
      },

      // use these handlers to update the game
      onStartOfBattle: function (data) {
        console.log('start', data);
      },

      onTick: function (data) {
        console.log('tick', data);
      },

      onEndOfBattle: function (data) {
        console.log('end', data);
      }
    };
  })
  .controller('GameCtrl', [
    '$scope',
    'socket',
    'gameListeners',
    'renderer',
    function ($scope, socket, gameListeners, renderer) {
      $scope.woop = 'sjsjsjs';

      gameListeners.add(socket, renderer);
  }]);
