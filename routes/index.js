var campaign = require('../models/campaign');

/*
 * GET home page.
 */

exports.index = function(req, res){
  campaign.find({}).sort('-createDate').exec(function (err, campaigns) {
    res.render('index', { campaigns: campaigns })
  });
};
