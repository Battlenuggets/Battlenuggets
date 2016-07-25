angular.module('battle.store', [])

.controller('StoreController', ['$scope', 'Store', 'Auth', function ($scope, Store, Auth) {
  $scope.wallet = 0;
  $scope.items = [
    {
      name: 'Signed Dead Golden Nugget',
      price: 100,
      img: 'img/DeadGoldSigned.png'
    },
    {
      name: 'Signed Golden Nugget',
      price: 5000,
      img: 'img/GoldNuggetSigned.png'
    },
    {
      name: 'Signed Dead Chicken Nugget',
      price: 900,
      img: 'img/DeadMeatSigned.png'
    },
    {
      name: 'Signed Chicken Nugget',
      price: 1000000,
      img: 'img/ChickenNuggetSigned.png'
    }
  ];
  $scope.inventory = [];
  $scope.purchaseCandidate = {};

  $scope.authed = function () {
    return Auth.authed();
  };

  $scope.canAfford = function (item) {
    return $scope.wallet - item.price >= 0;
  };

  $scope.alreadyOwns = function (item) {
    return $scope.inventory.indexOf(item.name) !== -1;
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
        $scope.inventory = JSON.parse(inventory);
      });
  };

  $scope.updateCurrency();
  $scope.updateInventory();
}]);
