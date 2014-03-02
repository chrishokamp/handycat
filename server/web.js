var gzippo = require('gzippo')
	, express = require('express')
	, http = require('http')
	, getJSON = require('./getJSON')
	, cors = require('cors')
	, app = express();

// use thei node superagent module instead?

app.use(cors());
app.use(app.router);
app.use(express.logger('dev'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));

// Working - add a route to query media wiki
app.get('/wikipedia', function(req, res){
	console.log('i just got a POST request to /wikipedia');
//	res.render('wiki/edit', {
//      title: 'Editing Wiki',
//      wiki: wiki_entry
//    })
	var query = '&srsearch="query"';
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

app.listen(process.env.PORT || 5000);
