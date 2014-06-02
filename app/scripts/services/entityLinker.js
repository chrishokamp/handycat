// sends text and gets back annotated segments
// how to apply markup to words and segments dynamically?
//  - make a directive that can find and wrap text from a callback

angular.module('services')
.factory('entityLinker', ['$log', '$http', function($log, $http) {

  var spotlightEndpoint = 'http://spotlight.sztaki.hu:2222/rest/annotate';
  // sample call
  var sampleCall = 'http://spotlight.sztaki.hu:2222/rest/annotate?text=Berlin+was+the+capital+of+the+Kingdom+of+Prussia+(1701%E2%80%931918)%2C+the+German+Empire+(1871%E2%80%931918)%2C+the+Weimar+Republic+(1919%E2%80%9333)+and+the+Third+Reich+(1933%E2%80%9345).+Berlin+in+the+1920s+was+the+third+largest+municipality+in+the+world.&confidence=0.5&support=0&spotter=Default&disambiguator=Default&policy=whitelist&types=&sparql=';
    //http://spotlight.sztaki.hu:2222/rest/annotate?text=Berlin+was+the+capital+of+the+Kingdom+of+Prussia+(1701%E2%80%931918)%2C+the+German+Empire+(1871%E2%80%931918)%2C+the+Weimar+Republic+(1919%E2%80%9333)+and+the+Third+Reich+(1933%E2%80%9345).+Berlin+in+the+1920s+was+the+third+largest+municipality+in+the+world.&confidence=0.5&support=0&spotter=Default&disambiguator=Default&policy=whitelist&types=&sparql=

  return {
    annotate: function(text) {
      var params = {
        "confidence" : 0.5,
        "support" : 0,
        "spotter" : "Default",
        "disambiguator" : "Default",
        "policy" : "whitelist",
        "types" : "",
        "sparql" : ""
      }
      $log.log("annotating entities");
      $log.log(spotlightEndpoint);
      params["text"] = text;
      $log.log(params);

      // working - return a promise to the controller
      var linkPromise = $http({
        url: spotlightEndpoint,
        method: 'GET',
        params: params
        //cache: false
      });

      linkPromise.then(
        function (res) {
          $log.log('entity linking res: ');
          $log.log(res);

        },
        function(e) {
          $log.log('Error in entity linking request');
        }
      )
    }
  }



}]);
