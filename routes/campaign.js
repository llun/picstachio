var Campaign = require('../models/campaign');

module.exports = {

  // HTML Render zone
  addPage: function (req, res) {
    res.render('campaign-add');
  },

  // API zone
  add: function (req, res) {
    console.log (req.body);
    var campaign = new Campaign(req.body);
    campaign.save(function (err) {
      if (err) {
        res.json(err);
      }
      else {
        res.json(campaign);
      }
    });

  }

}