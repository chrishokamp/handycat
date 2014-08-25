var express = require('express')
   bodyParser = require('body-parser'),
   cookieParser = require('cookie-parser'),
   http = require('http'),
   session = require('express-session'),
   errorHandler = require('express-error-handler'),
   methodOverride = require('method-override'),
//   logger = require('express-logger'),
   passport = require('passport'),
   path = require('path'),
   fs = require('fs'),
   mongoStore = require('connect-mongo')(session),
	 params = require('express-params'),
	 cors = require('cors'),
	 getJSON = require('./server/getJSON'),
   config = require('./server/config/config')

var app = express();

// Connect to database
var db = require('./server/db/mongo').db;

// Bootstrap models - Chris - let's you avoid adding each module explicitly
var modelsPath = path.join(__dirname, '/server/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

var pass = require('./server/config/pass');

// App Configuration
//var env = process.env.NODE_ENV || 'development';
var env = 'production';

if ('development' == env) {
   // configure stuff here
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(errorHandler());
  app.set('views', __dirname + '/app/views');
}

if ('production' == env) {
//  app.use(express.favicon(path.join(__dirname, 'dist', 'favicon.ico')));
  app.use(express.static(path.join(__dirname, 'dist')));
  app.set('views', __dirname + '/dist/views');
}

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// TODO: logging isn't working currently
//app.use(logger('dev'));

// TODO: remove this
app.use(cors());

// bodyParser should be above methodOverride
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());

// cookieParser should be above session
app.use(cookieParser());
// express/mongo session storage
app.use(session({
  secret: config.secret,
  store: new mongoStore({
    url: config.db,
    collection: 'sessions'
  }),
  resave: true,
  saveUninitialized: true
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());

//routes should be at the last
//app.use(app.router);

params.extend(app);

//Bootstrap routes
require('./server/config/routes')(app);

// TODO: move these routes to a separate file and bootstrap
// add a route to query media wiki
app.param('lang', /^\w{2}$/);
app.get('/wikipedia/:lang', function(req, res){
  console.log('i just got a GET request to /wikipedia/:lang');
  // the search parameter name is 'srsearch'
  var lang = req.params.lang.toString().trim();
  console.log('the req param is: ' + lang);
  console.log('the req query param is: ' + req.query.srsearch);
  // Question: put in quotes to search literally
  var searchQuery = encodeURIComponent(req.query.srsearch);
  var query = '&srsearch=' + searchQuery;

  var lang_host = '';
  if(lang === 'en') {
      console.log('lang is: en');
      lang_host = 'en.wikipedia.org';
  } else if (lang === 'de') {
      lang_host = 'de.wikipedia.org';
  }
  var options = {
    host: lang_host,
    path: '/w/api.php?action=query&format=json&list=search&srprop=snippet' + query,
    method: 'GET'
  };
  getJSON.getJSON(options,
	function(result) {
		var searchResults = result.query.search;
		//console.log(JSON.stringify(searchResults, null, 3));
   		res.setHeader('Content-Type', 'application/json');
   		res.send(searchResults);
	});

});

// add a route to query glosbe as a glossary
// glosbe says that you can get around limits by using jsonp
// add a route to query media wiki
app.get('/glossary', function(req, res){
  console.log('i just got a GET request to /glossary');
  // @params
  // fromlang
  // tolang
  // query
  // TODO: understand why the parsing of the params sometimes doesn't work
  var fromLang=req.query.from;
  var toLang=req.query.dest;
  if (fromLang === undefined)
    fromLang='eng';
  if (toLang === undefined)
    toLang='deu';
  // note the & is missing from the 'from' param
  var from = 'from=' + fromLang;
  var to = '&dest=' + toLang;
  var phrase = '&phrase=' + encodeURIComponent(req.query.phrase);
  var format = '&format=json'
  console.log('the req phrase param is: ' + req.query.phrase);
  var options = {
    host: 'glosbe.com',
//    path: '/gapi/tm?' + from + to + phrase;
    path: '/gapi/translate?' + from + to + phrase + format,
    method: 'GET'
// EXAMPLE:
// http://glosbe.com/gapi/tm?from=eng&dest=deu&format=json&phrase="the company grew"&pretty=true
  };
  getJSON.getJSON(options,
    function(result) {
      //var searchResults = result.query.search;
      // TODO: make sure every item is unique (this might be done on their side)
      var matches = result.tuc.map(function (glossaryObj) {
        // parse the results here
        var p = glossaryObj.phrase;
        return p;
      })
        .filter(function(match) {
          if (match !== undefined) {
            return true;
          }
        });

      var searchResults = matches;
      console.log('the result from the glosbe API: ');
      console.log(matches);

      //console.log(JSON.stringify(searchResults, null, 3));
      res.setHeader('Content-Type', 'application/json');
//      res.setHeader('Content-Type', 'application/json');
      res.send(searchResults);
    });

});

//var DbEntities = require('./server/db/queryEntities');
var DbEntities = require('./server/db/queryEntities');
// MONGO DB ENTITY STORE ROUTES
app.get('/surface-forms/:lang/:entity', function(req, res){
  console.log('i just got a GET request to /surface');
  DbEntities.findSurfaceFormByEntityName(req, res);
//  res.setHeader('Content-Type', 'application/json');
//  res.send(searchResults);
});

// Note that this route must be first, since /logger/:sessionId also matches
var ActionLogger = require('./server/logger/actionLogger');
app.post('/logger/start', function(req, res){
  console.log('posting to /logger/start');
  ActionLogger.startSession(req, res);
});

// working -- how to manage which users can write to which logs? - see express passport & openID
var ActionLogger = require('./server/logger/actionLogger');
app.post('/logger/:sessionId', function(req, res){
  var sessionId = req.param('sessionId');
  console.log('posting to /logger/:sessionId with id ' + sessionId);
  console.log(sessionId);
  ActionLogger.addEntryToSession(sessionId, req, res);
//  res.setHeader('Content-Type', 'application/json');
//  res.send({ "logged": true });
});

app.listen(process.env.PORT || 5002);

// other datasources to try:
// tausdata, wiktionary
