(function () {
  'use strict';

  angular
    .module('shoppinglists')
    .controller('ShoppinglistsListController', ShoppinglistsListController);

  ShoppinglistsListController.$inject = ['ShoppinglistsService'];

  function ShoppinglistsListController(ShoppinglistsService) {
    var vm = this;

    vm.shoppinglists = ShoppinglistsService.query();
  }
}());
