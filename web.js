Error.stackTraceLimit = Infinity;

var express = require('express'),
   bodyParser = require('body-parser'),
   cookieParser = require('cookie-parser'),
   http = require('http'),
   https = require('https'),
   session = require('express-session'),
   errorHandler = require('express-error-handler'),
   methodOverride = require('method-override'),
   //passport = require('passport'),
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

// Bootstrap models - this approach lets you avoid adding each model explicitly
var modelsPath = path.join(__dirname, '/server/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});


// App Configuration
var env = process.env.NODE_ENV || 'development';
//var env = 'production';

if ('development' === env) {
   // configure stuff here
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(errorHandler());
  app.set('views', __dirname + '/app/views');
}

if ('production' === env) {
//  app.use(express.favicon(path.join(__dirname, 'dist', 'favicon.ico')));
  app.use(express.static(path.join(__dirname, 'dist')));
  app.set('views', __dirname + '/dist/views');
}

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// TODO: logging isn't working currently
//app.use(logger('dev'));

app.use(cors());

// bodyParser should be above methodOverride
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

// cookieParser should be above session
app.use(cookieParser());

// express/mongo/passport session storage
app.use(session({
  secret: config.secret,
  store: new mongoStore({
    url: config.db,
    collection: 'sessions'
  }),
  resave: true,
  saveUninitialized: true
}));
// configure passport serializeUser and deserializeUser
// note that this method of setting up passport returns a _modified_ and _configured_ version of passport
var passport = require('./server/config/passport');
// use passport session
app.use(passport.initialize());
app.use(passport.session());

//routes should be at the last
//app.use(app.router);

params.extend(app);

// TODO: move this to routes, call the TM inside the TM middleware
app.use('/users/:userId/tm', function(req, res, next) {
  // invoked for any request starting with /users/:userId/tm
  console.log('Inside web.js - test TM middleware')
  next();
});

app.use('/tm', function(req, res, next) {
  // invoked for any request starting with /users/:userId/tm
  console.log('Inside web.js - test TM middleware')
  next();
});

// TODO: move these routes to a separate file and bootstrap
// CONCORDANCER -- using wikipedia (via wikimedia API)
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

  // removes the region from the language (if any)
  // en-US -> en, es-ES -> es
  var lang = lang.split('-')[0];
  var lang_host = lang + '.wikipedia.org';

  var options = {
    host: lang_host,
    path: '/w/api.php?action=query&format=json&list=search&srprop=snippet' + query,
    method: 'GET'
  };
  getJSON.getJSON(options,
	function(result) {
		var searchResults = result.query.search;
 		res.json(searchResults);
	});

});

// express-redis-cache middleware
//var cache = require('express-redis-cache')();
// TODO: WORKING - the glossary route should be an interface to all of the user's glossaries
// add a route to query glosbe as a glossary
// glosbe says that you can get around limits by using jsonp
// routes which implement the glossary API should be specified in the config
app.get('/glossary',
  //cache.route(),
  function(req, res){
  // @params
  // fromlang
  // tolang
  // query

  // TODO: add a full language code mapping/conversion utility
  // TODO: this mapping will need to be done for every utility that does not conform to BCP 47: http://tools.ietf.org/html/bcp47#appendix-A
  var langCodeMapping = {
    'en-US': 'eng',
    'de-DE': 'deu'
  };

  var fromLang=req.query.sourceLang;
  var toLang=req.query.targetLang;

  // default language codes - TODO: testing only
  if (fromLang === undefined)
    fromLang='eng';
  if (toLang === undefined)
    toLang='deu';
  if (langCodeMapping[toLang]) toLang = langCodeMapping[toLang];
  if (langCodeMapping[fromLang]) fromLang = langCodeMapping[fromLang];
  // note the & is missing from the 'from' param
  var from = 'from=' + fromLang;
  var to = '&dest=' + toLang;
  var phrase = '&phrase=' + encodeURIComponent(req.query.phrase);
  var format = '&format=json'
  var options = {
    host: 'glosbe.com',
//    path: '/gapi/tm?' + from + to + phrase;
    path: '/gapi/translate?' + from + to + phrase + format,
    method: 'GET',
    // set protocol to https - glosbe requires this
    port: 443
// EXAMPLE:
// https://glosbe.com/gapi/tm?from=eng&dest=deu&format=json&phrase="the company grew"&pretty=true
  };
  getJSON.getJSON(options,
    function(result) {
      var matches = result.tuc.map(
        function (glossaryObj) {
          // parse the results here
          var p = glossaryObj.phrase;
          return p;
        }
      )
      .filter(function(match) {
        if (match !== undefined) {
          return true;
        }
      });

      // make sure there aren't any duplicates
      var unique = {};
      matches.forEach(function(match) {
        unique[match.text] = 1;
      })

      matches = matches.filter(function(i) {
        return unique[i.text];
      })
      res.json(matches);
    });

});

// This is for the entity linker demo
// TODO: move this to a plugin
//var DbEntities = require('./server/db/queryEntities');
var DbEntities = require('./server/db/queryEntities');
// MONGO DB ENTITY STORE ROUTES
app.get('/surface-forms/:lang/:entity', function(req, res){
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

//Bootstrap routes - remember that routes must be added after application middleware
require('./server/config/routes')(app);

//app.listen(process.env.PORT || 5002);
var server = http.createServer(app).listen(process.env.PORT || 5002);
console.log('Express server listening on port: ' + server.address().port);

// For https -- note that you need a certificate for this to work
//var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
//var credentials = {key: privateKey, cert: certificate};
//https.createServer(options, app).listen(443);
//https.createServer(options, app).listen(8443);

// other datasources to try:
// tausdata, wiktionary
