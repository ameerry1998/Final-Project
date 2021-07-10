'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var EventSchema = Schema( {
  creatorName: String,
  creatorNumber: String,
  date: String,
  venue: String,
  Ground_transportation: String,
  Photography: String,
  Florist: String,
  Catering: String,
  Band: String,
  DJ: String,
  Ice_sculpture: String,
  description:String,
  userId: ObjectId
} );

module.exports = mongoose.model( 'Event', EventSchema );
