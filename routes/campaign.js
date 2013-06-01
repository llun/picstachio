var Campaign = require('../models/campaign');

module.exports = {

  // HTML Render zone
  addPage: function (req, res) {
    res.render('campaign-add');
  },

  // API zone
  add: function (req, res) {
    var input = {
      name: req.body.name,
      description: req.body.description,
      owner: req.user.id,
      endDate: req.body.endDate
    };

    var campaign = new Campaign(input);
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