angular.module('battle.store', [])

.controller('StoreController', ['$scope', 'Store', 'Auth', function ($scope, Store, Auth) {
  $scope.wallet = 0;

  // this is basically a placeholder for an 'items' table in the database
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

  // the following filter access to the purchase button
  $scope.canAfford = function (item) {
    return $scope.wallet - item.price >= 0;
  };

  $scope.alreadyOwns = function (item) {
    return $scope.inventory.indexOf(item.name) !== -1;
  };

  $scope.nominate = function (item) {
    // when purchase is clicked, first the item is nominated so
    // the page can offer confirmation, then purchase is called
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

  // syncs the page with the database, used after a purchase is made
  // and when the page loads the first time
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
