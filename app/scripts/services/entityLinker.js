// sends text and gets back annotated segments
// how to apply markup to words and segments dynamically?
//  - make a directive that can find and wrap text from a callback

angular.module('services')
.factory('entityLinker', ['$log', '$http', function($log, $http) {

  var spotlightEndpoint = 'http://spotlight.sztaki.hu:2222/rest';
  // sample call
  var sampleCall = 'http://spotlight.sztaki.hu:2222/rest/annotate?text=Berlin+was+the+capital+of+the+Kingdom+of+Prussia+(1701%E2%80%931918)%2C+the+German+Empire+(1871%E2%80%931918)%2C+the+Weimar+Republic+(1919%E2%80%9333)+and+the+Third+Reich+(1933%E2%80%9345).+Berlin+in+the+1920s+was+the+third+largest+municipality+in+the+world.&confidence=0.5&support=0&spotter=Default&disambiguator=Default&policy=whitelist&types=&sparql=';

  return {
    annotate: function() {
      $http.get(sampleCall).then(
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
