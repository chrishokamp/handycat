'use strict';

define(['services/services'], function(services) {

  services.factory('TranslationMemory', ['$http', '$log', function( $http, $log ) {
    // An interface to a translation memory on the backend (currently uses the Amagama TM server)
    // Send a segment and get matches back (in JSON)
    // Each segment has its own controller, so we don't need to call the callback with an index

    // There are several parameters which can be passed in the URL
    var min_sim = '30';

    var getUrl = 'http://localhost:8999/tmserver/en/de/unit/';
    return {
      similarityThreshold: 70, // default
      getMatches: function(query, callback) {
        var queryUrl = getUrl + query + '?min_similarity=' + this.similarityThreshold;
        $http.get(queryUrl)
          .success(function(data) {
            $log.info("query was: " + query)
            $log.info("RESULT FROM TM: " + data);
            $log.log(data);
// TODO: let the user choose whether to replace or not
            if (data === undefined) {
              callback([]);
            } else {
              var tmMatches = data;
              callback(tmMatches);
            }
          })
          .error(function(e) {
            $log.error("Translation memory error for query: " + query);
          }
        );
      }
    }


  }]);
});