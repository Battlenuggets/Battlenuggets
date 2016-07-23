angular.module('battle.store', [])

.controller('StoreController', function ($scope, Store) {
  $scope.wallet = 0;
  $scope.items = [
    {
      name: 'nugget icon',
      price: 15
    },
    {
      name: 'nuggetlord icon',
      price: 50
    },
    {
      name: 'nuggetgod icon',
      price: 500
    }
  ];
  $scope.inventory = [];

  $scope.purchase = function (item) {
    Store.purchase(item)
      .then(function () {
        alert('purchased!');
        $scope.updateCurrency();
      });
  };

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
