angular.module('battle.store', [])

.controller('StoreController', function ($scope, Store, Auth) {
  $scope.wallet = 0;
  $scope.items = [
    {
      name: 'test1',
      price: 0,
      img: 'img/chat1.ico'
    }
  ];
  $scope.inventory = [];
  $scope.purchaseCandidate = {};

  $scope.authed = function () {
    return Auth.authed();
  };

  $scope.canAfford = function (item) {
    return $scope.wallet - item.price >= 0;
  }

  $scope.alreadyOwns = function (item) {
    return $scope.inventory.indexOf(item.name) !== -1;
  }

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
        $scope.inventory = JSON.parse(inventory);
      });
  };

  $scope.updateCurrency();
  $scope.updateInventory();
});
