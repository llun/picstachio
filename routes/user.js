var UserModel = require('../models/user');

module.exports = {

  loginPage: function (req, res) {
    res.render('login');
  },

  registerPage: function (req, res) {
    res.render('register');
  },

  register: function (req, res) {
    var user = new UserModel(req.body);
    user.save(function (err) {
      if (err) {
        console.log (err);
        req.flash('error', err);
        res.redirect('/users/register.html');
      }
      else {
        res.redirect('/');
      }
    });
    res.redirect('/');
  },
  
  logout: function (req, res) {
    req.logout();
    req.flash('info', 'Logout success');
    res.redirect('/users/login.html');
  }

}