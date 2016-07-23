angular.module('battle.store', [])

.controller('StoreController', function ($scope, Store, Auth) {
  $scope.wallet = 0;
  $scope.items = [
    {
      name: 'test1',
      price: 10,
      img: 'img/chat1.ico'
    }
  ];
  $scope.inventory = '';
  $scope.purchaseCandidate = {};

  $scope.authed = function () {
    return Auth.authed();
  };

  $scope.nominate = function (item) {
    $scope.purchaseCandidate = item;
  };

  $scope.purchase = function () {
    Store.purchase($scope.purchaseCandidate)
      .then(function () {
        alert('purchased!');
        $scope.updateCurrency();
        $scope.updateInventory();
      })
  }

  $scope.updateCurrency = function () {
    Store.getCurrency()
      .then(function (currency) {
        $scope.wallet = currency;
      });
  };

  $scope.updateInventory = function () {
    Store.getInventory()
      .then(function (inventory) {
        $scope.inventory = inventory;
      });
  };

  $scope.updateCurrency();
  $scope.updateInventory();
});
