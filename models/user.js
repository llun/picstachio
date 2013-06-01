var database = require('./database'),
    mongoose = require('mongoose');

var schema = mongoose.Schema({
  username: { type: 'String', required: true },
  password: { type: 'String', required: true },
  email: { type: 'String', required: true }
});

var User = database.model('User', schema);
module.exports = User;