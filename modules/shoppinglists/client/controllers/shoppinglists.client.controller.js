(function () {
  'use strict';

  // Shoppinglists controller
  angular
    .module('shoppinglists')
    .controller('ShoppinglistsController', ShoppinglistsController);

  ShoppinglistsController.$inject = ['$scope', '$location', '$state', '$window', 'Authentication', 'shoppinglistResolve'];

  function ShoppinglistsController ($scope, $location, $state, $window, Authentication, shoppinglist) {
    var vm = this;

    vm.myList = [];

    vm.authentication = Authentication;
    vm.shoppinglist = shoppinglist;
    vm.error = null;
    vm.form = {};
    vm.addItem = addItem;
    vm.removeItem = removeItem;
    vm.removeCheckedItems = removeCheckedItems;
    vm.remove = remove;
    vm.save = save;


    // Remove existing Shoppinglist
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.shoppinglist.$remove($state.go('shoppinglists.list'));
      }
    }

    // ADD ITEM to the list array
    function addItem(isValid) {
      vm.myList = vm.shoppinglist.items;
      vm.myList.push({
        name: vm.name,
        priority: vm.priority,
        notes: vm.notes,
        isChecked: vm.isChecked
      });

      vm.name = '';
      vm.priority = '';
      vm.notes = '';
      vm.isChecked = false;
      
      //SAVE for adding items to list
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.shoppinglistItemsForm');
        return false;
      }

      if (vm.shoppinglist._id) {
        vm.shoppinglist.$update(successCallback, errorCallback);
      } 

      function successCallback(res) {
        $state.go('shoppinglists.view', {
          shoppinglistId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }

    //to remove an item from list
    function removeItem(item) {
      vm.items = vm.shoppinglist.items;
      var itemToDelete = vm.items.indexOf(item);
      vm.shoppinglist.items.splice(itemToDelete, 1);

      if (vm.shoppinglist._id) {
        vm.shoppinglist.$update(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('shoppinglists.view', {
          shoppinglistId: res._id
        });
      }
      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    //to remove all 'checked' items from list
    function removeCheckedItems() {
      vm.items = vm.shoppinglist.items;
      for (var i = (vm.items.length-1); i > -1; i--) {
        if (vm.items[i].isChecked) {
          // console.log(vm.items[i]);
          vm.items.splice(i,1);
        }
      }

      if (vm.shoppinglist._id) {
        vm.shoppinglist.$update(successCallback, errorCallback);
      } 

      function successCallback(res) {
        $state.go('shoppinglists.view', {
          shoppinglistId: res._id
        });
      }
      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }

    // Save Shoppinglist
    function save(isValid) {
      vm.shoppinglist.items = vm.items;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.shoppinglistForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.shoppinglist._id) {
        vm.shoppinglist.items = vm.items;

        vm.shoppinglist.$update(successCallback, errorCallback);
      } else {
        vm.shoppinglist.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('shoppinglists.view', {
          shoppinglistId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());