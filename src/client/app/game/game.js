var Game = window.Game;

angular.module('battle.game', [])
  .factory('gameListeners', function () {
    return {
      // add the renderer's socket event handlers
      add: function (socket, renderer) {
        socket.on('start of battle', renderer.onStartOfBattle);
        socket.on('tick', renderer.onTick);
        socket.on('end of battle', renderer.onEndOfBattle);
      }
    };
  })
  .factory('renderer', function () {
    var width = 500;
    var height = 500;

    var game = new Game(width, height);
    var ctx;

    return {
      // find the canvas in the dom, and start rendering to it via `gameloop`.
      // note that every time we leave and revisit the canvas, a new canvas
      // element is created. so we have to run `start` again to make sure
      // that `game` is drawing to the correct canvas.
      start: function () {
        // find and resize the canvas
        var canvas = document.getElementById('canvas');
        canvas.width = width;
        canvas.height = height;

        // update `ctx` in the outer scope
        ctx = canvas.getContext('2d');

        var lastTimestamp;
        var nextTimestamp;

        function gameloop (timestamp) {
          lastTimestamp = nextTimestamp;
          nextTimestamp = timestamp;

          // generally, most games have an underlying structure where:

          // 1. we `update` their state (here we're telling `update` how much
          // time has passed since the last update).

          // 2. we draw the current state to the screen.

          // and repeat that forever
          game.update((nextTimestamp - lastTimestamp) / 1000);
          game.draw(ctx);

          // `requestAnimationFrame(gameloop)` is _basically_ like just calling
          // `gameloop()`. the difference is that `requestAnimationFrame` knows
          // not to keep drawing to the canvas if for example the window's
          // minimized, or the tab's inactive, or whatever. it's an abstraction
          // that automatically only renders new stuff if it'll actually be seen
          requestAnimationFrame(gameloop);
        }

        // call `gameloop` manually for the first time, to start off the
        // infinite loop.
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
    'socket',
    'gameListeners',
    'renderer',
    function (socket, gameListeners, renderer) {
      gameListeners.add(socket, renderer);
      renderer.start();
    }
  ]);
