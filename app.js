// All dependencies live here
var express = require('express'),
    path = require('path'),
    less_middleware = require('less-middleware'),
    routes = require('./routes'),
    campaign = require('./routes/campaign');

var flash = require('connect-flash');

var express = require('express')
  , routes = require('./routes');

var app = express();

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

app.get('/', routes.index);
app.get('/campaign/add.html', campaign.addPage);
app.get('/campaign/list.html', campaign.listPage);

// server codes
app.listen(app.get('port'), function () {
  console.log ('Express server listening on port ' + app.get('port'));
});
