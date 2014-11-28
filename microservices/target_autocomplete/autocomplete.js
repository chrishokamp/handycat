// create a single express route to the autocomplete service
var express = require('express');
var fs = require('fs');
var Autocomplete = require('triecomplete');
var cors = require('cors');

var app = express();
app.use(cors());

var filename = 'test/1000.de';
var germanWords = fs.readFileSync(filename, {encoding: 'utf8'})
  .trim()
  .split('\n')
  .map(function(line, idx) {
    return [line.toLowerCase(), line];
  })

var auto = new Autocomplete()
auto.initialize(germanWords)

app.get('/', function(req, res) {
  var prefix = req.param('prefix').toLowerCase();
  console.log('completer: GET');
  console.log('prefix is: ' +prefix);
  var matches = auto.search(prefix);
  console.log('matches');
  console.log(matches);
  // default format of triecomplete is:  { key: 'Ein letzter Gedanke .', value: 'Ein letzter Gedanke .' },
  var mappedMatches = matches.map(function(matchObj) {
    return { completion: matchObj['value'] };
  });

  console.log('matches is: ');
  console.log(matches);
  res.send(JSON.stringify(mappedMatches));
});

app.listen(8000);
console.log('Listening on port 8000');

