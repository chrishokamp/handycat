angular.module('services').factory('GermanStemmer', ['$http', '$log', function($http, $log) {
    // we have the stemmer code in lib/
    var deStemmer = new Stemmer();
    // load the stem map

    var stemMap = {};
    $http.get('data/smart_word_forms/german_stem_map.json')
      .success(function(data) {
        $log.log("GOT THE STEM MAP");
        $log.log("Map for key: gross");
        $log.log(data['gross']);

        // initialize the stemMap
        stemMap = data;
      })

    return {
      stem: function(word) {
        return deStemmer.stem(word);
      },
      getOtherForms: function(stem) {
        return stemMap[stem];
      }
    }
}]);
