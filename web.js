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
   config = require('./server/config/config'),
   _ = require('lodash');

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

// express-redis-cache middleware
// configure the cache based upon where we are
if ('development' === env) {
   // configure stuff here
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(errorHandler());
  app.set('views', __dirname + '/app/views');

  // setup the local redis cache
  var cache = require('express-redis-cache')();
}

if ('production' === env) {
//  app.use(express.favicon(path.join(__dirname, 'dist', 'favicon.ico')));
  app.use(express.static(path.join(__dirname, 'dist')));
  app.set('views', __dirname + '/dist/views');

  // TODO: if we are on heroku
  // setup the REDISTOGO connection on heroku - from https://devcenter.heroku.com/articles/nodejs-support
  //var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  //var redis = require("redis").createClient(rtg.port, rtg.hostname);
  //redis.auth(rtg.auth.split(":")[1]);

  //var cache = require('express-redis-cache')({
  //  client: redis
  //});
  //console.log('NODE_ENV: ' + process.env.NODE_ENV);

  // TODO: if we are not on heroku
  // setup the local redis cache
  var cache = require('express-redis-cache')();

}
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

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
  // the search parameter name is 'srsearch'
  var lang = req.params.lang.toString().trim();

  // Question: put in quotes to search literally?
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
    function(err, result) {
      if (err) {
        res.status(404)
        res.send();
      }
      var searchResults = result.query.search;
      res.json(searchResults);
    },
    res
  );

});

// TODO: WORKING - the glossary route should be an interface to all of the user's glossaries
// add a route to query glosbe as a glossary
// glosbe says that you can get around limits by using jsonp
// routes which implement the glossary API should be specified in the config

// TODO: glosbe returns html on error -- handle that case
var q = require('q');
var queryGlosbe = function (fromLang, toLang, queryString, res) {
  // lowercase query
  queryString = queryString.toLowerCase();

  console.log('query glosbe with (lowercased): ' + queryString);

  var deferred = q.defer();
  // TODO: add a full language code mapping/conversion utility that covers most lang-code conventions
  // TODO: this mapping will need to be done for every utility that does not conform to BCP 47: http://tools.ietf.org/html/bcp47#appendix-A
  // TODO: let each field be a regex to make the mapping shorter and more flexible
  var langCodeMapping = {
    'en-US': 'eng',
    'en-us': 'eng',
    'de-DE': 'deu',
    'es-ES': 'spa',
    'es': 'spa',
    'de': 'deu'
  };
  if (langCodeMapping[toLang]) toLang = langCodeMapping[toLang];
  if (langCodeMapping[fromLang]) fromLang = langCodeMapping[fromLang];

  // note the & is missing from the 'from' param
  var from = 'from=' + fromLang;
  var to = '&dest=' + toLang;
  var phrase = '&phrase=' + encodeURIComponent(queryString);
  var format = '&format=json'
  var options = {
    host  : 'glosbe.com',
    path  : '/gapi/translate?' + from + to + phrase + format,
    method: 'GET',
    // set protocol to https - glosbe requires this
    port  : 443
// EXAMPLE:
// https://glosbe.com/gapi/tm?from=eng&dest=deu&format=json&phrase="the company grew"&pretty=true
  };
  // TODO: use the requests library for this
  getJSON.getJSON(options,
    function (err, result) {
      if (err) {
        deferred.reject(err);
        return;
      }
      var matches = result.tuc.map(
        function (glossaryObj) {
          // parse the results here
          var p = glossaryObj.phrase;
          return p;
        }
      )
        .filter(function (match) {
          if (match !== undefined) {
            return true;
          }
        });

      // make sure there aren't any duplicates
      var unique = {};
      matches.forEach(function (match) {
        unique[match.text] = 1;
      })

      matches = matches.filter(function (i) {
        return unique[i.text];
      })
      deferred.resolve(matches);
    },
    res
  );
  return deferred.promise;
}

// take the request, and get the params to pass to the glossary function
var askGlossary = function(req,res) {
  var fromLang = req.query.sourceLang;
  var toLang = req.query.targetLang;
  var queryString = req.params.word.toString().trim();
  var glossaryPromise = queryGlosbe(fromLang, toLang, queryString, res);
  glossaryPromise.then(
    function(matches) {
      console.log('from glosbe:');
      console.log(matches);
      res.json(matches);
    }
  );
}

var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var glossaryWordList = function(req,res) {
  var sourceLang = 'en-US';
  var targetLang = 'de-DE';
  // tokenize the sentence, and query the glossary for everything that's not punctuation
  var phrase = req.params.phrase.toString().trim()
  var tokens = tokenizer.tokenize(phrase);
  console.log(tokens);

  // call queryGlosbe for every token
  // wait till every promise resolves
  var allQueries = tokens.map(function(token) {
    return queryGlosbe(sourceLang, targetLang, token, res);
  });
  // TODO: this isn't handling errors correctly
  q.all(allQueries).then(
    function(allResults) {
      res.json(_.flatten(allResults));
    },
    function(err) {
      res.status(404);
      res.json('error');
    }
  );

}

// TODO: glossary is disabled for now until errors are properly handled
//app.get('/glossary/segment/:phrase', cache.route(), glossaryWordList);
//app.get('/glossary/word/:word', cache.route(), askGlossary);


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
app.post('/logger', function(req, res){
  console.log('posting to /logger');
  ActionLogger.logAction(req, res);
});

// working -- how to manage which users can write to which logs? - see express passport & openID
//var ActionLogger = require('./server/logger/actionLogger');
//app.post('/logger/:sessionId', function(req, res){
//  var sessionId = req.param('sessionId');
//  console.log('posting to /logger/:sessionId with id ' + sessionId);
//  console.log(sessionId);
//  ActionLogger.addEntryToSession(sessionId, req, res);
//  res.setHeader('Content-Type', 'application/json');
//  res.send({ "logged": true });
//});

// Note that we need to proxy microservice routes

// lm_autocompleter
var request = require('request');

// baseline -- return empty list
app.get('/lm_autocomplete/default', function(req,res) {
  res.json({'ranked_completions': []});
});

// WORKING: add language parameter to this endpoint
app.get('/imt/neural_imt', function(req,res) {
  console.log('IMT ENDPOINT');
  console.log(req.query);
  var lang_code_mapping = {
    'en-EN': 'en',
    'fr-FR': 'fr',
    'de-DE': 'de',
    'pt-PT': 'pt',
    'pt-BR': 'pt',
    'ga-IE': 'ga'
  }
  // TODO: error when lang_code is not found -- otherwise this can fail silently
  nimtUrl = 'http://localhost:5000/nimt';
  var options = {
    uri: nimtUrl,
    method: 'POST',
    json: {
      "source_lang": lang_code_mapping[req.query.source_lang],
      "target_lang": lang_code_mapping[req.query.target_lang],
      "source_sentence": req.query.source_segment,
      "target_prefix": req.query.target_prefix,
      "request_time": req.query.request_time
    }
  };

  request(options, function (error, response, body) {
    if (error && error.code === 'ECONNREFUSED'){
      console.error('Refused connection to: ' + nimtUrl);
    }
  }).pipe(res);
});


var url = require('url');
app.get('/lm_autocomplete/constrained', function(req,res) {
  var url_parts = url.parse(req.url, true);
  var query_hash = url_parts.query;

  // TODO: read the microservice locations from config
  var newurl = 'http://localhost:8010/lm_autocomplete';
  request({url: newurl, qs: query_hash},
    function(error, response, body){
      if (error && error.code === 'ECONNREFUSED'){
        console.error('Refused connection to: ' +  newurl);
      }
    }
  ).pipe(res);
});

// vocablist
// proxy to the vocab list server/:langn
app.get('/vocablist/:lang', function(req,res) {
  var lang = req.params.lang.toString().trim();
  console.log('lang: ' + lang);
  // TODO: read the microservice locations from config
  // TODO: why doesn't localhost work with restify?
  var newurl = 'http://0.0.0.0:8082/vocablist/' + lang;
  request(newurl,
    function(error, response, body){
      if (error && error.code === 'ECONNREFUSED'){
        console.error('Refused connection to: ' + newurl);
      }
    }
  ).pipe(res);
});

// graph tm
var graphTMUrl = 'http://localhost:8899/tm';
app.get('/tm', function(req,res) {
  var url_parts = url.parse(req.url, true);
  var query_hash = url_parts.query;

  // TODO: read the microservice locations from config
  var newurl = 'http://localhost:8899/tm';
  request({url: newurl, qs: query_hash},
    function(error, response, body){
      if (error && error.code === 'ECONNREFUSED'){
        console.error('Refused connection');
      }
    }
  ).pipe(res);
});
app.post('/tm', function(req,res) {
  var newurl = 'http://localhost:8899/tm';
  console.log('tm req body');
  console.log(req.body);

  request({url: newurl, json: req.body},
    function(err, remoteResponse, remoteBody) {
      if (error && error.code === 'ECONNREFUSED'){
        console.error('Refused connection');
      }
      res.end(remoteBody);
    });
});

// End microservice proxies


//Bootstrap routes - remember that routes must be added after application middleware
require('./server/config/routes')(app);

//app.listen(process.env.PORT || 5002);
var server = http.createServer(app).listen(process.env.PORT || 5002);
//console.log('Express server listening on port: ' + server.address().port);

// For https -- note that you need a certificate for this to work
//var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
//var credentials = {key: privateKey, cert: certificate};
//https.createServer(options, app).listen(443);
//https.createServer(options, app).listen(8443);

// other datasources to try:
// tausdata, wiktionary
