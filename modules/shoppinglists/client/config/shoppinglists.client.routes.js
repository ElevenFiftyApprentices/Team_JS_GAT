(function () {
  'use strict';

  angular
    .module('shoppinglists')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('shoppinglists', {
        abstract: true,
        url: '/shoppinglists',
        template: '<ui-view/>'
      })
      .state('shoppinglists.list', {
        url: '',
        templateUrl: 'modules/shoppinglists/client/views/list-shoppinglists.client.view.html',
        controller: 'ShoppinglistsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Shoppinglists List'
        }
      })
      .state('shoppinglists.create', {
        url: '/create',
        templateUrl: 'modules/shoppinglists/client/views/form-shoppinglist.client.view.html',
        controller: 'ShoppinglistsController',
        controllerAs: 'vm',
        resolve: {
          shoppinglistResolve: newShoppinglist
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Shoppinglists Create'
        }
      })
      .state('shoppinglists.edit', {
        url: '/:shoppinglistId/edit',
        templateUrl: 'modules/shoppinglists/client/views/form-shoppinglist.client.view.html',
        controller: 'ShoppinglistsController',
        controllerAs: 'vm',
        resolve: {
          shoppinglistResolve: getShoppinglist
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Shoppinglist {{ shoppinglistResolve.name }}'
        }
      })
      .state('shoppinglists.view', {
        url: '/:shoppinglistId',
        templateUrl: 'modules/shoppinglists/client/views/view-shoppinglist.client.view.html',
        controller: 'ShoppinglistsController',
        controllerAs: 'vm',
        resolve: {
          shoppinglistResolve: getShoppinglist
        },
        data: {
          pageTitle: 'Shoppinglist {{ shoppinglistResolve.name }}'
        }
      });
  }

  getShoppinglist.$inject = ['$stateParams', 'ShoppinglistsService'];

  function getShoppinglist($stateParams, ShoppinglistsService) {
    return ShoppinglistsService.get({
      shoppinglistId: $stateParams.shoppinglistId
    }).$promise;
  }

  newShoppinglist.$inject = ['ShoppinglistsService'];

  function newShoppinglist(ShoppinglistsService) {
    return new ShoppinglistsService();
  }
}());
