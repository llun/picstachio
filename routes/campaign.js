var crypto = require('crypto'),
    knox = require('knox'),
    q = require('q'),
    _ = require('underscore');

var client = knox.createClient({
    key: 'AKIAJMWRPBMTW5L7HBJA',
    secret: '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',
    bucket: 'picstachio'
  });

var Bid = require('../models/bid'),
    Campaign = require('../models/campaign');

module.exports = {

  // HTML Render zone
  addPage: function (req, res) {
    res.render('campaign-add', { page: 'new-campaign' });
  },

  campaignPage: function (req, res) {
    var _campaign = null;
    var _bids = null;
    q.nfcall(Campaign.findById.bind(Campaign), req.params.campaign)
      .then(function (campaign) {
        _campaign = campaign;
        return q.nfcall(Bid.find.bind(Bid), { campaign: req.params.campaign });
      })
      .then(function (bids) {
        _bids = bids;
        res.render('campaign-info', { campaign: _campaign, bids: _bids });
      })
      .fail(function (err) {
        res.redirect('/');
      });
  },

  bidPage: function (req, res) {
    var id = req.params.id;
    Campaign.findById(id, function (err, campaign) {
      if (campaign) {
        res.render('bid', campaign);
      }
      else {
        res.redirect('/');
      }
    });
  },

  bidCompletePage: function (req, res) {
    var _campaign = null;
    var _bid = null;
    q.nfcall(Campaign.findById.bind(Campaign), req.params.campaign)
      .then(function (campaign) {
        _campaign = campaign;
        return q.nfcall(Bid.findById.bind(Bid), req.params.bid);
      })
      .then(function (bid) {
        _bid = bid;
        res.render('bid-complete', { campaign: _campaign, bid: _bid });
      })
      .fail(function (err) {
        res.redirect('/');
      });
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

    if (req.files.files.length > 0) {
      var maps = _.map(req.files.files, function (file) {
        var hash = crypto.createHash('sha1');
        hash.update(file.name);
        var d = hash.digest('hex');
        return q.nfcall(client.putFile.bind(client),
                file.path,
                '/res/' +  (new Date().getTime()) + d,
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
          res.status(302);
          res.header('Location', '/');
          res.json(campaign);
        })
        .fail(function (err) {
          res.json(err);
        })
        .done();
    }
    else {
      campaign = new Campaign(input);
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
  },

  bid: function (req, res) {
    var input = {
      campaign: req.params.id,
      owner: req.user._id,
      price: req.body.price,
      images: []
    }
    var bid = null;

    if (req.files.pictures.length > 0) {
      var maps = _.map(req.files.pictures, function (file) {
        var hash = crypto.createHash('sha1');
        hash.update(file.name);
        var d = hash.digest('hex');
        return q.nfcall(client.putFile.bind(client),
                file.path,
                '/bid/' +  (new Date().getTime()) + d,
                { 'x-amz-acl': 'public-read' });
      });
      q.all(maps)
        .then(function (out) {
          input.images = [];
          _.each(out, function (v) {
            input.images.push(v.req.url);
          });
          bid = new Bid(input);
          return q.nfcall(bid.save.bind(bid));
        })
        .then(function () {
          req.flash('info', 'You have placed 1 bid on this campaign. If you bid is accepted you will receive a notification.');
          res.status(302);
          res.header('Location', '/campaign/' + req.params.id + '/bid.html');
          res.json(bid);
        })
        .fail(function (err) {
          res.json(err);
        })
        .done();
    }
    else {
      req.flash('error', 'Image is required');
      res.redirect('/campaign/' + req.param.id + '/bid.html');
    }
  }

}