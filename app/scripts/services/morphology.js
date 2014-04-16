angular.module('services').factory('Morphology', [ '$http','$log', function($http, $log) {

  // Cache of words requested in the current session.
  // Prevents multiple calls to the server for the same word.
  // TODO(xpl) cache
  // var wordCache = {};

  var routePrefix = 'http://0.0.0.0:5001/morphology/';
  var default_lang = 'de';

  return {
    // Given a word, returns the word with the number changes if possible.
    // changeNumber('dog', 'en', 'I have two dog') -> 'dogs'
    // changeNumber('dogs', 'en', 'I have one dogs') -> 'dog'

    // returns a promise
    changeNumber: function (phrase, lang, context) {
      $log.log('changeNumber call: ' + phrase + ' ' + lang);
      if (!context)
        context = '';

      var morphologyRoute = '';
      lang ? morphologyRoute = routePrefix + lang : morphologyRoute = routePrefix + default_lang;

      var data = { "phrase": phrase, "to_number": 'Pl' };
      return $http.post(morphologyRoute, data);
//      return $http({
//        url: morphologyRoute,
//        method: "POST",
//        data: {
//          "phrase": phrase,
//          "to_number": 'Pl'
//        },
//        headers: {'Content-Type': 'application/json'}
//      });
    },
    // Change the gender of a word - in general, we can only change the number of adjectives, articles, and pronouns
    changeGender: function(word, lang, context) {
      $log.log('changeGender call: ' + word + ' ' + lang);
      // TODO(ximop) call the webservice
      return word;
    }
  };

}]);