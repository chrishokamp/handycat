'use strict';

// TODO: the TM should point in both directions, right now it only goes e-->f
// TODO- align subsegments to their source token ids - this requires tokenization!
define(['services/services'], function(services) {

  services.factory('TranslationMemory', ['$http', '$log', function( $http, $log ) {
    // An interface to a translation memory on the backend (currently uses the Amagama TM server)
    // Each segment has its own controller, so we don't need to call the callback with an index

    // There are several parameters which can be passed in the URL
    var min_sim = '30';

    var getUrl = 'http://localhost:8999/tmserver/en/de/unit/';
    return {
      TM: {}, // holds all of the TM matches for every segment queried so far (lists of TM objects)
      similarityThreshold: 60, // 70 is default
      getMatches: function(query, callback, self) {
        if (!self)
          var self = this;
        // TODO: url encode the queryString!
        var queryUrl = getUrl + encodeURIComponent(query) + '?min_similarity=' + this.similarityThreshold;
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
              callback(query, tmMatches, self);
            }
          })
          .error(function(e) {
            $log.error("Translation memory error for query: " + query);
          }
        );
      },
      // we need to pass in 'self' because this function may be used in callbacks
      addItems: function(queryString,tmMatches, self) {
        if (!self)
          var self = this;
        if (self.TM[queryString]) {
          self.TM[queryString].push(tmMatches);
        } else {
          self.TM[queryString] = tmMatches;
        }
        return self.TM[queryString];
      },
      populateTM: function(subphrases) {
        // handle a string or a list of tokenLists
        var self = this;
        if (typeof subphrases === 'string') {
          self.getMatches(subphrases, self.addItems, self);
        } else if (subphrases instanceof Array) {
          _.each(subphrases, function(tokenList){
            var qString = tokenList.join(' ');
            self.getMatches(qString, self.addItems, self);
          });
        }
      }
    }


  }]);
});