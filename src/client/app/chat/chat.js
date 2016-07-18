angular.module('chatRoom', [])
  .factory('socket', function () {
    return io.connect('http://localhost:8000');
  })

  .controller('ChatCtrl', function ($scope, socket) {
    // place holder incase we want chat messages to be sent
    // to the server and stored there instead
    $scope.msgs = [];

    $scope.sendMsg = function () {
      socket.emit('send msg', $scope.chatmsg);
      $scope.chatmsg = '';
    };

    socket.on('get msg', function (data) {
      $scope.msgs.push(data);
      $scope.$digest();
    });
  });
