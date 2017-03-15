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
    default: '#736F6E',  //Gray
    trim: true
  },
  name: {
    type: String,
    default: '',
    // required: 'Please provide an item name',
    trim: true
  },
  priority: {
    type: String,
    default: 'Low',
    // required: 'Please select the priority for this item',
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
  },
  item: {
    type: String,
    default: ''
  },
  items: {
    type: [],
    default: [],
    required: 'Please enter shopping items' 
  }  
});

mongoose.model('Shoppinglist', ShoppinglistSchema);