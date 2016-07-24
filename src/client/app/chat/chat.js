angular.module('battle.chatRoom', [])
  .controller('ChatCtrl', ['$scope', 'socket', 'Auth', function ($scope, socket, Auth) {
    // place holder incase we want chat messages to be sent
    // to the server and stored there instead
    $scope.msgs = [];
    $scope.id;

    $scope.check = function () {
      Auth.getUserIdFromServer();
    };

    $scope.sendMsg = function () {
      socket.emit('send msg', $scope.chatmsg);
      $scope.chatmsg = '';
    };

    socket.emit('connection name', Auth.getId());

    socket.on('new user', function () {
      if (Auth.authed()) {
        Auth.getUserIdFromServer();
        $scope.id = Auth.getId()
      } else {
        $scope.id ='Anonymous';
      }
    });

    socket.on('get msg', function (data) {
      $scope.msgs.push(data);
      $scope.$digest();
    });
  }]);
