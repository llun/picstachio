var database = require('./database'),
    mongoose = require('mongoose');

var schema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  budget: { type: Number },
  images: [],
  endDate: { type: Date },
  createDate: { type: Date, default: Date.now },
  owner: { type: String, required: true }
});

var Campaign = database.model('Campaign', schema);
module.exports = Campaign;