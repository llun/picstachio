var mongoose = require('mongoose');

var databaseURL = process.env.MONGO_URL || 'mongodb://picstachio:1picstachio;@ds027618.mongolab.com:27618/picstachio';
var database = mongoose.createConnection(databaseURL);

module.exports = database;