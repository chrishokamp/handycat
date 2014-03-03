var gzippo = require('gzippo')
	, express = require('express')
	, http = require('http')
	, getJSON = require('./getJSON')
	, cors = require('cors')
	, app = express();

// use the node superagent module instead?

app.use(cors());
app.use(app.router);
app.use(express.logger('dev'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));

// add a route to query media wiki
app.get('/wikipedia', function(req, res){
	console.log('i just got a GET request to /wikipedia');
	// the search parameter name is 'srsearch'
	var query = '&srsearch=' + req.query.srsearch;
	console.log('the req query param is: ' + req.query.srsearch);
	var options = {
	  host: 'en.wikipedia.org',
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
  var phrase = '&phrase=' + req.query.phrase;
  var format = '&format=json'
  console.log('the req phrase param is: ' + req.query.phrase);
  var options = {
    host: 'glosbe.com',
//    path: '/gapi/tm?' + from + to + phrase;
    path: '/gapi/translate?' + from + to + phrase + format,
    method: 'GET'
// EXMAPLE:
// http://glosbe.com/gapi/tm?from=eng&dest=deuk&format=json&phrase="the company grew"&pretty=true
  };
  getJSON.getJSON(options,
    function(result) {
      //var searchResults = result.query.search;
      var searchResults = result;
      console.log('the result from the glosbe API: ');
      console.log(result);
      //console.log(JSON.stringify(searchResults, null, 3));
      res.setHeader('Content-Type', 'application/json');
      res.send(searchResults);
    });

});


// other datasources to try:
// wiktionary


app.listen(process.env.PORT || 5000);
