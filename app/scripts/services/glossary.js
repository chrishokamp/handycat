// Working - provide the ectaco dictionary from this service
angular.module('services').factory('Glossary', [ '$http', '$log', function($http,$log) {
  // load the file from data/
  // TODO: move this glossary to a backend service
//  var glossaryFile = 'data/ectaco-en-pos-de.tsv';

  //development
  // the ectaco german dictionary
  var glossaryFile = 'data/glossary.small.tsv';

  // working -- interface with the glosbe translate API
  // check whether CORS is ok
//   http://glosbe.com/gapi/tm?from=eng&dest=deuk&format=json&phrase="the company grew"&pretty=true
//  var baseUrl = 'http://localhost:5000/glossary';
  var baseUrl = 'http://protected-crag-2517.herokuapp.com/glossary';

  // Note: a glossary is for LOOKUP, not autocomplete
  var Glossary = {
    // allWords for autocomplete
    allWords: [],
// TODO: add top level keys using language codes
    glossary: {},
    getMatches: function(phrase, callback) {
      $log.log('Inside Glossary service, getting matches for: ' + phrase);
      // ask the node server for matches from the glosbe API
      var self = this;
      if (self.glossary[phrase]) {
        callback(self.glossary[phrase]);
      } else {

        $http.get(baseUrl, {
          params: {
            phrase: phrase,
            from: 'eng',
            dest: 'deu',
            origin: 'http://0.0.0.0:9000'
          }
        })
          .success(function(res) {
            $log.log('results for: ' + phrase);
            $log.log(res);

            var phrases = res;
            $log.log("Glossary result: " + res);

            // cache the result
            self.glossary[phrase] = phrases;
            callback(phrases);
          })
          .error(function(err) {
            $log.log('Error in concordancer: ' + err.message);
            callback(null);
          })
      }
    }
  }

// TODO: move this to a separate autocomplete service
  // en --> de index for Autocomplete
  $http.get(glossaryFile)
    .success(function(data) {
      var lines = data.match(/[^\r\n]+/g);
      var dictionary = _.map(lines, function(line) {
        var units = line.split('\t');
        var translations = units[2].split(', ');
        return {source: units[0], pos: units[1], targets: translations};
      });
      // now add every target word to the autocomplete
      _.each(dictionary, function(unit){
        _.each(unit.targets, function(targetWord) {
          Glossary.allWords.push(targetWord);
        });
      });

      $log.log("dictionary object");
      $log.log(dictionary);
      $log.log("allWords");
      $log.log(Glossary.allWords);

    })
  return Glossary;

}]);
