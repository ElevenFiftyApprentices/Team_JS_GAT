// Shoppinglists service used to communicate Shoppinglists REST endpoints
(function () {
  'use strict';

  angular
    .module('shoppinglists')
    .factory('ShoppinglistsService', ShoppinglistsService);

  ShoppinglistsService.$inject = ['$resource'];

  function ShoppinglistsService($resource) {
    return $resource('api/shoppinglists/:shoppinglistId', {
      shoppinglistId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
