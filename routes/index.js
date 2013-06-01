var q = require('q'),
    _ = require('underscore');

var campaign = require('../models/campaign'),
    user = require('../models/user');

/*
 * GET home page.
 */

exports.index = function(req, res){
  var _campaigns = [];
  var query = campaign.find({}).sort('-createDate');
  q.nfcall(query.exec.bind(query))
    .then(function (campaigns) {
      _campaigns = campaigns;
      var map = _.map(campaigns, function (campaign) {
        return q.nfcall(user.findById.bind(user), campaign.owner);
      });
      return q.all(map);
    })
    .then(function (users) {
      var output = [];
      _.each(_campaigns, function (campaign, index) {
        var c = campaign.toJSON();
        c.owner = users[index].toObject();
        output.push(c);
      });
      res.render('index', { campaigns: output });
    })
    .fail(function (err) {
      res.render('index', { campaigns: [] });
    });

};
