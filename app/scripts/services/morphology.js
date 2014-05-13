angular.module('services').factory('Morphology', [ '$http','$log', function($http, $log) {

  // Cache of words requested in the current session.
  // Prevents multiple calls to the server for the same word.
  // TODO(xpl) cache
  // var wordCache = {};

  // local prefix
  var routePrefix = 'http://0.0.0.0:5001/morphology/';
  // current AWS
//  var routePrefix = 'http://ec2-54-186-18-81.us-west-2.compute.amazonaws.com:5001/morphology/';
  var default_lang = 'de';

  return {
    // these functions return promises
    changeNumber: function (phrase, lang) {
      $log.log('changeNumber call: ' + phrase);
      var morphologyRoute = '';
      lang ? morphologyRoute = routePrefix + lang : morphologyRoute = routePrefix + default_lang;

      var data = { "phrase": phrase, "change_type": 'rfNumber' };
      return $http.post(morphologyRoute, data, { timeout: 10000 });
    },
    // Change the gender of a word or phrase - in general, we can only change the number of adjectives, articles, and pronouns
    changeGender: function(phrase, lang) {
      $log.log('changeGender call: ' + phrase);
      var morphologyRoute = '';
      lang ? morphologyRoute = routePrefix + lang : morphologyRoute = routePrefix + default_lang;

      var data = { "phrase": phrase, "change_type": 'rfGender' };
      return $http.post(morphologyRoute, data, { timeout: 10000 });
    },
    changeCase: function(phrase, lang) {
      $log.log('changeCase call: ' + phrase);
      var morphologyRoute = '';
      lang ? morphologyRoute = routePrefix + lang : morphologyRoute = routePrefix + default_lang;

      var data = { "phrase": phrase, "change_type": 'rfCase' };
      return $http.post(morphologyRoute, data, { timeout: 10000 });
    }
  };

}]);