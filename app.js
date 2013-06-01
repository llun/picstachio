// All dependencies live here
var express = require('express'),
    path = require('path'),
    moment = require('moment'),
    less_middleware = require('less-middleware'),
    routes = require('./routes'),
    campaign = require('./routes/campaign'),
    user = require('./routes/user');

var security = require('./security');

var UserModel = require('./models/user');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(express);
var app = express();

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function (username, password, done) {
    UserModel.authenticate(username, password, function (err, user) {
      return done(null, user, err);
    });
  }));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  UserModel.findById(id, function (err, user) {
    done(err, user);
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.use(less_middleware({
    src: __dirname + '/public',
    force: true
  }));
 });

app.configure('production', function() {
  app.use(less_middleware({src: __dirname + '/public'}));
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('randomcookie'));

  app.use(express.session({
    secret: 'cookiessecret',
    store: new MongoStore({
      url: process.env.MONGO_URL || 'mongodb://picstachio:1picstachio;@ds027618.mongolab.com:27618/picstachio'
    })
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function (req, res, next) {
    res.locals.user = req.user;
    res.locals.flash = req.flash();
    next();
  });

  app.use(app.router);
});

app.locals.title = 'Picstachio';
app.locals.moment = moment;

app.get('/', routes.index);

// Campaign zone
app.get('/campaign/add.html', security.requiredLogin, campaign.addPage);
app.get('/campaign/list.html', campaign.listPage);
app.get('/campaign/:id/bid.html', security.requiredLogin, campaign.bidPage);
app.get('/campaign/:campaign/bid/:bid.html', security.requiredLogin, campaign.bidCompletePage);

app.post('/campaign/add', security.requiredLogin, campaign.add);
app.post('/campaign/:id/bid', security.requiredLogin, campaign.bid);

// User zone
app.get('/users/login.html', user.loginPage);
app.get('/users/register.html', user.registerPage);

app.post('/users/login', passport.authenticate('local',
  { successRedirect: '/',
    failureRedirect: '/users/login.html',
    failureFlash: true }));
app.get('/users/logout', user.logout);
app.post('/users/new', user.register);

// server codes
app.listen(app.get('port'), function () {
  console.log ('Express server listening on port ' + app.get('port'));
});
