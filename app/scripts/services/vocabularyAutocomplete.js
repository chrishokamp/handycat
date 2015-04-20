// a service holding a fast trie prefix autocomplete intended to store the most frequent items in
// a language's vocabulary

// depends upon  chrishokamp:node-autocomplete being available via browserify -- see scripts/lib
angular.module('handycat.trieAutocomplete', ['handycatConfig']);

angular.module('handycat.trieAutocomplete')
.factory('vocabularyAutocompleter', ['vocablistURL', '$q', '$http', '$log', function(vocablistURL, $q, $http, $log) {

    var Autocomplete = require('triecomplete')
    var vocabAutocompleter = new Autocomplete()
// results will be an array with 0 or more elements

// here results will be an array of key-value pairs
//    console.dir(results)

    //TODO: parameterize this, call and resolve the service (return new promise), when a project gets opened
    var targetLang = 'es';
    var autocompleteDeferred = $q.defer();
    // grab the vocabulary from a url
    // TODO: the language code is hard-coded
    $http.get(vocablistURL + '/' + targetLang)
      .then(
        function(res) {
          var vocabList = res.data;
          vocabAutocompleter.initialize(vocabList);
          autocompleteDeferred.resolve(vocabAutocompleter);
        }
    );

    // init the trie

    // return a promise that resolves with the trie API

    // clients should replace an empty obj with the trie API when it becomes available

    // TODO: clients will need to reset the vocabulary when the target language changes
    // this should happen when a new document gets opened

    return autocompleteDeferred.promise;

}]);

