'use strict';

/**
 * Module dependencies
 */
var shoppinglistsPolicy = require('../policies/shoppinglists.server.policy'),
  shoppinglists = require('../controllers/shoppinglists.server.controller');

module.exports = function(app) {
  // Shoppinglists Routes
  app.route('/api/shoppinglists').all(shoppinglistsPolicy.isAllowed)
    .get(shoppinglists.list)
    .post(shoppinglists.create);

  app.route('/api/shoppinglists/:shoppinglistId').all(shoppinglistsPolicy.isAllowed)
    .get(shoppinglists.read)
    .put(shoppinglists.update)
    .delete(shoppinglists.delete);

  // Finish by binding the Shoppinglist middleware
  app.param('shoppinglistId', shoppinglists.shoppinglistByID);
};
