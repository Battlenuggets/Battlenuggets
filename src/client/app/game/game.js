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
    var width = 500;
    var height = 500;

    var ctx;
    var game = new Game(width, height);

    return {
      // find the canvas in the dom, and start rendering to it via `gameloop`.
      start: function () {
        // find and resize the canvas
        var canvas = document.getElementById('canvas');
        canvas.width = width;
        canvas.height = height;

        // update `ctx` in the outer scope
        ctx = canvas.getContext('2d');

        var lastTimestamp;
        var nextTimestamp;

        function gameloop(timestamp) {
          lastTimestamp = nextTimestamp;
          nextTimestamp = timestamp;

          game.update((nextTimestamp - lastTimestamp) / 1000);
          game.draw(ctx);

          requestAnimationFrame(gameloop);
        }

        requestAnimationFrame(gameloop);
      },

      // use these handlers to update the game
      onStartOfBattle: function (data) {
        game.startBattle(data);
      },

      onTick: function (data) {
        game.tick(data);
      },

      onEndOfBattle: function (data) {
        game.endBattle(data);
      }
    };
  })
  .controller('GameCtrl', [
    '$scope',
    'socket',
    'gameListeners',
    'renderer',
    function ($scope, socket, gameListeners, renderer) {
      gameListeners.add(socket, renderer);
      renderer.start();
    }
  ]);
