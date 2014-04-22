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
    changeNumber: function (phrase, lang) {
      $log.log('changeNumber call: ' + phrase);
      var morphologyRoute = '';
      lang ? morphologyRoute = routePrefix + lang : morphologyRoute = routePrefix + default_lang;

      var data = { "phrase": phrase, "change_type": 'rfNumber' };
      return $http.post(morphologyRoute, data);
    },
    // Change the gender of a word or phrase - in general, we can only change the number of adjectives, articles, and pronouns
    changeGender: function(phrase, lang) {
      $log.log('changeGender call: ' + phrase);
      var morphologyRoute = '';
      lang ? morphologyRoute = routePrefix + lang : morphologyRoute = routePrefix + default_lang;

      var data = { "phrase": phrase, "change_type": 'rfGender' };
      return $http.post(morphologyRoute, data);
    },
    changeCase: function(phrase, lang) {
      $log.log('changeCase call: ' + phrase);
      var morphologyRoute = '';
      lang ? morphologyRoute = routePrefix + lang : morphologyRoute = routePrefix + default_lang;

      var data = { "phrase": phrase, "change_type": 'rfCase' };
      return $http.post(morphologyRoute, data);
    },
  };

}]);