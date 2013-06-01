module.exports = {

  loginPage: function (req, res) {
    res.render('login');
  },

  registerPage: function (req, res) {
    res.render('register');
  },

  register: function (req, res) {
    res.redirect('/');
  }

}