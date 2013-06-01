var campaign = require('../models/campaign');

/*
 * GET home page.
 */

exports.index = function(req, res){
  campaign.find({}, function (err, campaigns) {
    console.log (campaigns);
    res.render('index', { title: 'Express' })
  });
};
