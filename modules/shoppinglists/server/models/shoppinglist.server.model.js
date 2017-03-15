'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Shoppinglist Schema
 */
var ShoppinglistSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please provide a title for your shopping list',
    trim: true
  },
  color: {
    type: String,
    // default: '#' + vm.shoppinglist.color
    default: 'black',
    trim: true
  },
  name: {
    type: String,
    default: '',
    required: 'Please provide an item name',
    trim: true
  },
  priority: {
    type: String,
    default: '',
    trim: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Shoppinglist', ShoppinglistSchema);