angular.module('battle.chatRoom', [])
  .controller('ChatCtrl', ['$scope', 'socket', function ($scope, socket) {
    $scope.msgs = [];
    $scope.username = 'Anon';
    $scope.hasUser = true;

    // sets the client's username
    $scope.setUsername = function () {
      $scope.username = document.getElementsByClassName('usernameInput')[0].value;
      $scope.hasUser = false;
    };

    $scope.sendMsg = function () {
      $scope.obj = {
        username: $scope.username,
        message: $scope.chatmsg
      };
      socket.emit('send msg', $scope.obj);
      $scope.chatmsg = '';
    };

    socket.on('get msg', function (data) {
      $scope.msgs.push(data);
      $scope.$digest();
    });
  }]);
