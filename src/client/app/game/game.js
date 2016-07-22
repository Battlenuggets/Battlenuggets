angular.module('battle.game', [])
  .controller('GameCtrl', function ($scope, socket) {
    $scope.woop = 'sjsjsjs';

    socket.on('start of battle', function (data) {
      console.log('start', data);
    });

    socket.on('tick', function (data) {
      console.log('tick', data);
    });

    socket.on('end of battle', function (data) {
      console.log('end', data);
    });
  });
