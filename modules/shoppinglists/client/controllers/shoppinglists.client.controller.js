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
    // vm.removeAll = removeAll;
    vm.remove = remove;
    vm.save = save;
    // Remove existing Shoppinglist
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.shoppinglist.$remove($state.go('shoppinglists.list'));
      }
    }

    // ADD ITEM to the list array
    function addItem() {
      vm.myList.push({
        name: vm.name,
        priority: vm.priority,
        notes: vm.notes
      });

      vm.name = '';
      vm.priority = '';
      vm.notes = '';
    }

    //the functionality to delete items off list
    // vm.myList.removeItem = function(item) {
    //   var removeItem = vm.myList.items.indexOf(item);
    //   vm.myList.items.splice(removeItem, 1);
    // };
    function removeItem(item) {
      var removeItem = vm.myList.items.indexOf(item);
      vm.myList.items.splice(removeItem, 1);
    };

    vm.myList.removeAll = function() {
      vm.myList.items = [];
    };    

    // Save Shoppinglist
    function save(isValid) {
      // vm.shoppinglist.items = vm.myList;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.shoppinglistForm');
        return false;
      }

      if (vm.shoppinglist._id) {
        //do the update here
        // vm.shoppinglist.items = vm.shoppinglist.items.concat(vm.myLIst);
        newListArray = vm.shoppinglist.items.concat(vm.myList);
        vm.shoppinglist.items = newListArray;
      } else {
        //do the new array here
        vm.shoppinglist.items = vm.myList;
      }

      // TODO: move create/update logic to service
      if (vm.shoppinglist._id) {
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
