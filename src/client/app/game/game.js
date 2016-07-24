angular.module('battle.game', [])
  .factory('gameListeners', function () {
    var startOfBattleEvent = 'start of battle';
    var tickEvent = 'tick';
    var endOfBattleEvent = 'end of battle';

    return {
      add: function (socket, renderer) {
        socket.on(startOfBattleEvent, renderer.onStartOfBattle);
        socket.on(tickEvent, renderer.onTick);
        socket.on(endOfBattleEvent, renderer.onEndOfBattle);
      }
    };
  })
  .factory('renderer', function () {
    var canvas = document.getElementById('canvas');

    // TODO: either make entire page statically sized, or somehow add
    // resize handlers to this
    var width = canvas.width = 500;
    var height = canvas.height = 500;

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    var lastTimestamp;
    var nextTimestamp;

    var game = new Game(width, height);

    function gameloop(timestamp) {
      lastTimestamp = nextTimestamp;
      nextTimestamp = timestamp;

      game.update((nextTimestamp - lastTimestamp) / 1000);
      game.draw(ctx);

      requestAnimationFrame(gameloop);
    }

    requestAnimationFrame(gameloop);

    return {
      start: function () {
        // create a new game object here, and start up the game loop
      },

      // use these handlers to update the game
      onStartOfBattle: function (data) {
        game.createNuggets(data.fighters);
      },

      onTick: function (data) {
        game.handleTick(data);
        console.log('tick', data)
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
