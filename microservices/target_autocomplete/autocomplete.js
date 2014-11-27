// create a single express route to the autocomplete service
var express = require('express');
var fs = require('fs');
var Autocomplete = require('autocomplete');

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

var autocomplete = Autocomplete.connectAutocomplete();

// Initialize the autocomplete object and define a
// callback to populate it with data
autocomplete.initialize(function(onReady) {
  // get the autocomplete word list from a file
  // TODO: load the user's autocomplete list from a file
    onReady(germanWords);
});

// Later...  When it's time to search:
exports.test = function(prefix) {
  var matches = autocomplete.search(prefix);
  console.log(matches);

}
app.get('/', function(req, res) {
  var prefix = req.param('prefix').toLowerCase();
  console.log('completer: GET');
  console.log('prefix is: ' +prefix);
  var matches = autocomplete.search(prefix);
  // default format of node-autocomplete is:  { key: 'Ein letzter Gedanke .', value: 'Ein letzter Gedanke .' },
  var mappedMatches = matches.map(function(matchObj) {
    return { completion: matchObj['value'] };
  });

  console.log('matches is: ');
  console.log(matches);
  res.send(JSON.stringify(mappedMatches));
});

app.listen(8000);
console.log('Listening on port 8000');

