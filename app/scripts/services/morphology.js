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
  // possible params
  // case: {N, A, D, G}, gender: {F, M, N}, number: {S, P}, degree: { Degree Comp Pos Sup }
  return {
    // these functions return promises
    changeNumber: function (phrase, lang, param) {
      var morphologyRoute = '';
      lang ? morphologyRoute = routePrefix + lang : morphologyRoute = routePrefix + default_lang;

      if (_.contains(['Sg', 'Pl'], param)) {
        $log.log('changeNumber call: ' + phrase);
        var paramMap = {
          'to_number': param
        }
        var data = { "phrase": phrase, "change_type": 'rfNumber', "param_map": paramMap };

//        return $http.post(morphologyRoute, data, { timeout: 10000 });

        return $http.post('http://0.0.0.0:5001/morphology/convert/de', data, { timeout: 10000 });
      } else {
        throw new Error("Param: " + param + " is not an option for changeNumber");
      }
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
    },
    swapNumber: function (phrase, lang) {
      $log.log('changeNumber call: ' + phrase);
      var swapRoute = routePrefix + 'swap/' + default_lang;

      var data = { "phrase": phrase, "change_type": 'rfNumber' };
      return $http.post(morphologyRoute, data, { timeout: 10000 });
    },
    swapGender: function(phrase, lang) {
      $log.log('changeGender call: ' + phrase);
      var swapRoute = routePrefix + 'swap/' + default_lang;

      var data = { "phrase": phrase, "change_type": 'rfGender' };
      return $http.post(swapRoute, data, { timeout: 10000 });
    },
    swapCase: function(phrase, lang) {
      $log.log('changeCase call: ' + phrase);
      var swapRoute = routePrefix + 'swap/' + default_lang;

      var data = { "phrase": phrase, "change_type": 'rfCase' };
      return $http.post(swapRoute, data, { timeout: 10000 });
    }
  };

}]);