module.exports = {

  requiredLogin: function (req, res, next) {
    if (!req.user) {
      res.redirect('/users/login.html');
      res.set('Content-Type', 'application/json');
      res.json({ error: 'access denied' });
    }
    else { next(); }
  }

}