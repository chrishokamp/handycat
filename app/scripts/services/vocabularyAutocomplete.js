// a service holding a fast trie prefix autocomplete intended to store the most frequent items in
// a language's vocabulary

// depends upon  chrishokamp:node-autocomplete being available via browserify -- see scripts/lib
angular.module('handycat.trieAutocomplete', ['handycatConfig']);

angular.module('handycat.trieAutocomplete')
.factory('vocabularyAutocompleter', ['vocablistURL', '$q', '$http', '$log', function(vocablistURL, $q, $http, $log) {

    var Autocomplete = require('triecomplete')

    // vocabulary loads when a new document gets opened
    function getAutocompleter(targetLang) {
      var vocabAutocompleter = new Autocomplete()
      targetLang = targetLang.split('-')[0]
      var autocompleteDeferred = $q.defer();

      // grab the vocabulary from a url
      $http.get(vocablistURL + '/' + targetLang).then(
        function(res) {
          // results must be an array with 0 or more elements
          var vocabList = res.data;
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

