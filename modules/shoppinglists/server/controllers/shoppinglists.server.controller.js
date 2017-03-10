'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Shoppinglist = mongoose.model('Shoppinglist'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Shoppinglist
 */
exports.create = function(req, res) {
  var shoppinglist = new Shoppinglist(req.body);
  shoppinglist.user = req.user;

  shoppinglist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shoppinglist);
    }
  });
};

/**
 * Show the current Shoppinglist
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var shoppinglist = req.shoppinglist ? req.shoppinglist.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  shoppinglist.isCurrentUserOwner = req.user && shoppinglist.user && shoppinglist.user._id.toString() === req.user._id.toString();

  res.jsonp(shoppinglist);
};

/**
 * Update a Shoppinglist
 */
exports.update = function(req, res) {
  var shoppinglist = req.shoppinglist;

  shoppinglist = _.extend(shoppinglist, req.body);

  shoppinglist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shoppinglist);
    }
  });
};

/**
 * Delete an Shoppinglist
 */
exports.delete = function(req, res) {
  var shoppinglist = req.shoppinglist;

  shoppinglist.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shoppinglist);
    }
  });
};

/**
 * List of Shoppinglists
 */
exports.list = function(req, res) {
  Shoppinglist.find().sort('-created').populate('user', 'displayName').exec(function(err, shoppinglists) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shoppinglists);
    }
  });
};

/**
 * Shoppinglist middleware
 */
exports.shoppinglistByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Shoppinglist is invalid'
    });
  }

  Shoppinglist.findById(id).populate('user', 'displayName').exec(function (err, shoppinglist) {
    if (err) {
      return next(err);
    } else if (!shoppinglist) {
      return res.status(404).send({
        message: 'No Shoppinglist with that identifier has been found'
      });
    }
    req.shoppinglist = shoppinglist;
    next();
  });
};
