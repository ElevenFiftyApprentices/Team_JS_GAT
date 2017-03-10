(function () {
  'use strict';

  angular
    .module('shoppinglists')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Shoppinglists',
      state: 'shoppinglists',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'shoppinglists', {
      title: 'List Shoppinglists',
      state: 'shoppinglists.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'shoppinglists', {
      title: 'Create Shoppinglist',
      state: 'shoppinglists.create',
      roles: ['user']
    });
  }
}());
