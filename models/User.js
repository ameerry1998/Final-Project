'use strict';
const mongoose = require('mongoose'); //TODO what is mongoose?
const Schema = mongoose.Schema;

//var userSchema = mongoose.Schema( {any:{}})

var userSchema = Schema({
    googleid: String,
    googletoken: String,
    googlename: String,
    googleemail: String,
    userType :String,
    username: String,
    age: Number,
    imageURL: String,
});

module.exports = mongoose.model('User', userSchema);