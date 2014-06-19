var gzippo = require('gzippo')
	, express = require('express')
	, params = require('express-params')
	, http = require('http')
	, getJSON = require('./getJSON')
	, cors = require('cors')
	, app = express();

// use the node superagent module instead?

app.use(cors());
app.use(express.bodyParser());
// app.use(app.router);
params.extend(app);
app.use(express.logger('dev'));

// for hosting the app using express
app.use(gzippo.staticGzip("" + __dirname + "/../"));

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
  // note the & is missing from the first param
  var from = 'from=' + req.query.from;
  var to = '&dest=' + req.query.dest;
  var phrase = '&phrase=' + encodeURIComponent(req.query.phrase);
  var format = '&format=json'
  console.log('the req phrase param is: ' + req.query.phrase);
  var options = {
    host: 'glosbe.com',
//    path: '/gapi/tm?' + from + to + phrase;
    path: '/gapi/translate?' + from + to + phrase + format,
    method: 'GET'
// EXAMPLE:
// http://glosbe.com/gapi/tm?from=eng&dest=deuk&format=json&phrase="the company grew"&pretty=true
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
      res.send(searchResults);
    });

});

var DbEntities = require('./db/queryEntities');
// MONGO DB ENTITY STORE ROUTES
app.get('/surface-forms/:lang/:entity', function(req, res){
  console.log('i just got a GET request to /surface');
  DbEntities.findSurfaceFormByEntityName(req, res);
//  res.setHeader('Content-Type', 'application/json');
//  res.send(searchResults);
});

// Note that this route must be first, since /logger/:sessionId also matches
var ActionLogger = require('./logger/actionLogger');
app.post('/logger/start', function(req, res){
  console.log('posting to /logger/start');
  ActionLogger.startSession(req, res);
});

// working -- how to manage which users can write to which logs? - see express passport & openID
var ActionLogger = require('./logger/actionLogger');
app.post('/logger/:sessionId', function(req, res){
  console.log('posting to /logger/:sessionId');
  var sessionId = req.param('sessionId');
  console.log(sessionId);
  ActionLogger.addEntryToSession(sessionId, req, res);
  res.setHeader('Content-Type', 'application/json');
  res.send({ "logged": true });
});

app.listen(process.env.PORT || 5002);

// other datasources to try:
// wiktionary
