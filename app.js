// All dependencies live here
var express = require('express'),
    path = require('path'),
    less_middleware = require('less-middleware'),
    routes = require('./routes'),
    campaign = require('./routes/campaign'),
    user = require('./routes/user');

var UserModel = require('./models/user');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var flash = require('connect-flash');
var app = express();

passport.use(new LocalStrategy(
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
  app.use(flash());
  app.use(app.router);
});

app.locals.title = 'Picstachio';

app.get('/', routes.index);

// Campaign zone
app.get('/campaign/add.html', campaign.addPage);
app.get('/campaign/list.html', campaign.listPage);

app.post('/campaign/add', campaign.add);

// User zone
app.get('/users/login.html', user.loginPage);
app.get('/users/register.html', user.registerPage);

app.post('/users/register', user.register);

// server codes
app.listen(app.get('port'), function () {
  console.log ('Express server listening on port ' + app.get('port'));
});
