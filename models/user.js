var crypto = require('crypto');

var database = require('./database'),
    mongoose = require('mongoose');

var schema = mongoose.Schema({
  username: { type: 'String', required: true, unique: true },
  password: {
    type: 'String',
    required: true,
    set: function (value) {
      var hash = crypto.createHash('sha1');
      hash.update(value);
      return hash.digest('hex');
    }},
  email: { type: 'String', required: true }
});

schema.set('toObject', {
  getters: true,
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.__v;
    delete ret.id;
  }
});

var User = database.model('User', schema);
User.authenticate = function (username, password, cb) {
  User.findOne({ username: username }, function (err, user) {
    if (user) {
      var hash = crypto.createHash('sha1');
      hash.update(password);
      if (user.password === hash.digest('hex')) {
        cb(null, user);
      }
      else {
        cb(new Error('Wrong password'));
      }
    }
    else {
      cb(new Error('No user found'));
    }
  });
}

module.exports = User;