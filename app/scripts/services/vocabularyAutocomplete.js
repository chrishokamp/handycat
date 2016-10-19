// a service holding a fast trie prefix autocomplete intended to store the most frequent items in
// a language's vocabulary

// depends upon  chrishokamp:node-autocomplete being available via browserify -- see scripts/lib
angular.module('handycat.trieAutocomplete', ['handycatConfig']);

angular.module('handycat.trieAutocomplete')
.factory('vocabularyAutocompleter', ['vocablistURL', '$q', '$http', '$log', function(vocablistURL, $q, $http, $log) {

    var Autocomplete = require('triecomplete')
    var vocabAutocompleter = new Autocomplete()

    // TODO: clients will need to reset the vocabulary when the target language changes
    // this should happen when a new document gets opened
    //TODO: parameterize this, call and resolve the service (return new promise), when a project gets opened
    // TODO: the targetLang language code is hard-coded
    // WORKING: don't hardcode the target language -- resolve this when a project loads
    function getAutocompleter(targetLang) {
      var autocompleteDeferred = $q.defer();
      var targetLang = 'de'
      // grab the vocabulary from a url
      $http.get(vocablistURL + '/' + targetLang).then(
        function(res) {
          // results must be an array with 0 or more elements
          var vocabList = res.data;
          debugger;
          // init the trie
          vocabAutocompleter.initialize(vocabList);
          autocompleteDeferred.resolve(vocabAutocompleter);
        }
      );
      // return a promise that resolves with the trie API
      // clients should replace an empty obj with the trie API when it becomes available
      return autocompleteDeferred.promise;

    }

    return getAutocompleter

}]);

