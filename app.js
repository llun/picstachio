// All dependencies live here
var express = require('express'),
    path = require('path'),
    less_middleware = require('less-middleware'),
    routes = require('./routes');

var flash = require('connect-flash');

var app = express();

// passport and security session
var cookieSecret = 'tUjurat6';

// express.js configuration

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
  app.use(express.cookieParser(cookieSecret));
  app.use(flash());
  app.use(app.router);
});

app.get('/', routes.index);

// server codes
app.listen(app.get('port'), function () {
  console.log ('Express server listening on port ' + app.get('port'));
});
