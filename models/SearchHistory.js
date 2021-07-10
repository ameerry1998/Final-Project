'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var searchHistorySchema = Schema({
  userId: ObjectId,
  queryDate: Date,
  query: String,
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema, 'searchhistory');
