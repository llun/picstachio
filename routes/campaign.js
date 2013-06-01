var Campaign = require('../models/campaign');

module.exports = {

  // HTML Render zone
  addPage: function (req, res) {
    res.render('campaign-add');
  },

  // API zone
  add: function (req, res) {
    var input = req.body;
    input.owner = req.user.id;

    var campaign = new Campaign(req.body);
    campaign.save(function (err) {
      if (err) {
        res.json(err);
      }
      else {
        res.status(302);
        res.header('Location', '/');
        res.json(campaign);
      }
    });

  }

}