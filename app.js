
/**
 * Module dependencies.
 */

var express = require('express')
  , less_middleware = require('less-middleware')
  , routes = require('./routes');

var flash = require('connect-flash')
  , MongoStore = require('connect-mongo')(express);

var passport = require('passport')
  , LocalStategy = require('passport-local').Strategy;

var app = module.exports = express.createServer();

// Configuration

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(less_middleware({
    src: __dirname + '/public',
    force: true
  }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Routes

app.get('/', routes.index);

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
