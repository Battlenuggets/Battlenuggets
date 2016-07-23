angular.module('battle.game', [])
  .factory('gameListeners', function () {
    var startOfBattleEvent = 'start of battle';
    var tickEvent = 'tick';
    var endOfBattleEvent = 'end of battle';

    function onStartOfBattle (data) {
      console.log('start', data);
    }

    function onTick (data) {
      console.log('tick', data);
    }

    function onEndOfBattle (data) {
      console.log('end', data);
    }

    return {
      remove: function (socket) {
        socket.removeAllListeners(startOfBattleEvent);
        socket.removeAllListeners(tickEvent);
        socket.removeAllListeners(endOfBattleEvent);
      },

      add: function (socket) {
        // remove the existing listeners on the gamestate events so
        // that we don't have duplicate listeners
        this.remove(socket);

        socket.on(startOfBattleEvent, onStartOfBattle);
        socket.on(tickEvent, onTick);
        socket.on(endOfBattleEvent, onEndOfBattle);
      }
    };
  })
  .controller('GameCtrl', ['$scope', 'socket', 'gameListeners', function ($scope, socket, gameListeners) {
    $scope.woop = 'sjsjsjs';

    gameListeners.add(socket);
  }]);
