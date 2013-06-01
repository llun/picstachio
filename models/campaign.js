var database = require('./database'),
    mongoose = require('mongoose');

var schema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [],
  endDate: { type: Date },
  owner: { type: String, required: true }
});

var Campaign = database.model('Campaign', schema);
module.exports = Campaign;