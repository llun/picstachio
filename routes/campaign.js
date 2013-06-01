var Campaign = require('../models/campaign');

module.exports = {

  // HTML Render zone
  addPage: function (req, res) {
    res.render('campaign-add', { page: 'new-campaign' });
  },

  // API zone
  add: function (req, res) {

    var input = {
      name: req.body.name,
      description: req.body.description,
      owner: req.user.id
    };

    if (req.body.endDate) {
      var endDateNumber = Date.parse(req.body.endDate);
      if (!isNaN(endDateNumber)) {
        input.endDate = new Date(endDateNumber);
      }
    }

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