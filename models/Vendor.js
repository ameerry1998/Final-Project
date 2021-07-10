
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var VendorSchema = Schema( {
  name: String,
  industry: String,
  times: String,
  description: String,
  userId: ObjectId,
  phone_number: Number,
  Address: String
} );

module.exports = mongoose.model( 'Vendor', VendorSchema );
