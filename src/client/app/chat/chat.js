angular.module('battle.chatRoom', [])
  .controller('ChatCtrl', ['$scope', 'socket', function ($scope, socket) {
    // array of message objects to be rendered on the chat window
    $scope.msgs = [];
    $scope.username = 'Anon';
    $scope.hasUser = true;

    // sets the client's username
    $scope.setUsername = function () {
      // grabs the input field value for entering client's nickname
      $scope.username = document.getElementsByClassName('usernameInput')[0].value;
      $scope.hasUser = false;
    };

    // function to send a data obj to the server
    $scope.sendMsg = function () {
      $scope.obj = {
        username: $scope.username,
        message: $scope.chatmsg
      };
      // send the event to the server
      socket.emit('send msg', $scope.obj);
      // sets the input field to blank
      $scope.chatmsg = '';
    };

    //when receive the get msg event from the server with data
    socket.on('get msg', function (data) {
      // pushes the data obj (the same formatted obj in sendMsg) to an array to be rendered
      $scope.msgs.push(data);
      // use digest here because the DOM will not update correctly or immediately
      $scope.$digest();
    });
  }]);
