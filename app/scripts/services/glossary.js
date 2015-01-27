// Working - provide the ectaco dictionary from this service
angular.module('services').factory('Glossary', [ '$http', 'baseUrl', '$log', function($http,baseUrl,$log) {

  //development
  // the ectaco german dictionary
  //var glossaryFile = 'data/glossary.small.tsv';
//  var glossaryFile = 'data/ectaco-en-pos-de.tsv';

  // the glossary server - make sure the node server is running from server/
  //var baseUrl = 'http://localhost:5002';
  var urlPrefix = '/glossary';
  var glossaryUrl = baseUrl + urlPrefix;

  // Note: a glossary is for LOOKUP, not autocomplete
  var Glossary = {
    // allWords for autocomplete
    allWords: [],
// TODO: add top level keys using language codes
    glossary: {},
    getMatches: function(phrase, callback, fromLang, toLang, maxsize) {
      $log.log('Inside Glossary service, getting matches for: ' + phrase);
      // ask the node server for matches from the glosbe API
      var self = this;
      // simple cache
      if (self.glossary[phrase]) {
        callback(self.glossary[phrase]);
      } else {
        // TODO: make this api fixed - change 'dest' to 'targetLang' and 'from' to 'sourceLang'
        $http.get(glossaryUrl, {
          params: {
            phrase: phrase,
            from: fromLang,
            dest: toLang,
//            origin: 'http://0.0.0.0:9000'
          }
        })
          .success(function(res) {
            $log.log('results for: ' + phrase);
            $log.log(res);

            var phrases = res;
            $log.log("Glossary result: " + res);

            // Limit the glossary to 4 results for now according to the maxsize param
            //if (maxsize === undefined) maxsize = 5;
            //phrases = phrases.slice(0, maxsize);

            // cache the result
            self.glossary[phrase] = phrases;
            callback(phrases);
          })
          .error(function(err) {
            $log.error('Error in glossary ' + err);
            callback(null);
          })
      }
    }
  };

  return Glossary;
}]);
