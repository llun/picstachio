var knox = require('knox'),
    q = require('q'),
    _ = require('underscore');

var client = knox.createClient({
    key: 'AKIAJMWRPBMTW5L7HBJA',
    secret: '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',
    bucket: 'picstachio'
  });

var Campaign = require('../models/campaign');

module.exports = {

  // HTML Render zone
  addPage: function (req, res) {
    res.render('campaign-add', { page: 'new-campaign' });
  },

  bidPage: function (req, res) {
    res.render('bid');
  },

  // API zone
  add: function (req, res) {

    var campaign = null;
    var input = {
      name: req.body.name,
      description: req.body.description,
      owner: req.user.id,
      budget: req.body.budget
    };

    if (req.body.endDate) {
      var endDateNumber = Date.parse(req.body.endDate);
      if (!isNaN(endDateNumber)) {
        input.endDate = new Date(endDateNumber);
      }
    }

    var maps = _.map(req.files.files, function (file) {
      return q.nfcall(client.putFile.bind(client),
              file.path,
              '/res/' +  (new Date().getTime()),
              { 'x-amz-acl': 'public-read' });
    });
    q.all(maps)
      .then(function (out) {
        input.images = [];
        _.each(out, function (v) {
          input.images.push(v.req.url);
        });
        campaign = new Campaign(input);
        return q.nfcall(campaign.save.bind(campaign));
      })
      .then(function () {
        console.log ('Done');
        res.status(302);
        res.header('Location', '/');
        res.json(campaign);
      })
      .fail(function (err) {
        console.error (err);
        res.json(err);
      })
      .done();

  }

}