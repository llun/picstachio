var database = require('./database'),
    mongoose = require('mongoose');

var schema = mongoose.Schema({
  campaign: { type: String, required: true },
  owner: { type: String, required: true },
  createDate: { type: Date, required: true, default: Date.now },
  price: { type: Number, required: true },
  images: { type: Array, required: true }
});

var Bid = database.model('Bid', schema);
module.exports = Bid;