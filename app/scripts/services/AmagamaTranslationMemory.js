// TODO: the TM should point in both directions, right now it only goes e-->f
// TODO- align subsegments to their source token ids - this requires tokenization!
// TODO: formalize the TM item data model

angular.module('services').factory('AmagamaTranslationMemory', ['$http', '$timeout', '$log', function( $http, $timeout, $log ) {
  // An interface to a translation memory on the backend (currently uses the Amagama TM server)
  // Each segment has its own controller, so we don't need to call the callback with an index

  // There are several parameters which can be passed in the URL
  var min_sim = '30';

  // url to amagama tm server
  var getUrl = 'http://localhost:8999/tmserver/en/de/unit/';

  var mymemoryUrl = 'http://api.mymemory.translated.net/get?q=';
  var langPairStr = '&langpair=en|de';

  // my memory objects look like this:
  //matches: Array[3]
  //  0: Object
  //  create-date: "2014-02-09"
  //  created-by: "MT!"
  //  id: "0"
  //  last-update-date: "2014-02-09"
  //  last-updated-by: "MT!"
  //  match: 0.85
  //  quality: "70"
  //  reference: "Machine Translation provided by Google, Microsoft, Worldlingo or MyMemory customized engine."
  //  segment: "the file for"
  //  subject: "All"
  //  translation: "Die Datei für"
  //  usage-count: 1

  //$http({
  //  url: mymemoryUrl,
  //  method: "GET",
  //  params: urlParams
  //});


  return {
    TM: {}, // holds all of the TM matches for every segment queried so far (lists of TM objects)
    allMatches: [], // holds a list of all segments that we know about
    similarityThreshold: 60, // 70 is default
    searchTM: function(query) {
      // for this to be useful, we need to provide fuzzy matching logic
      // the ace editor autocomplete already provides some of that functionality
      // for now, make a custom autocomplete function which returns and filters EVERYTHING in the TM (i.e. all matches for all segments in this document)

    },
    getMatches: function(query, callback, self) {
      if (!self)
        var self = this;

      // TODO: consistent client-side API to the translationMemory -- the client shouldn't worry about WHICH tm is being called      // for amagama
      var queryUrl = getUrl + encodeURIComponent(query) + '?min_similarity=' + this.similarityThreshold;

      // for TausData

      // for myMemory
      // var queryUrl = mymemoryUrl + encodeURIComponent(query) + langPairStr;

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
// TODO: add a proper check to see if this item is already in the TM
    addItems: function(queryString,tmMatches, self) {
      if (!self)
        var self = this;
      if (tmMatches.length > 0) {
        if (self.TM[queryString]) {
          self.TM[queryString].push(tmMatches);
        } else {
          self.TM[queryString] = tmMatches;
        }

        _.each(tmMatches, function(match) {
          $log.log("logging tmMatch")
          $log.log(match);
          self.allMatches.push(match);

        })
        $log.log("logging allMatches")
        $log.log(self.allMatches);
      }
      // return im case someone wants to use the matches immediately
      return self.TM[queryString];
    },
    populateTM: function(subphrases) {
      // handle a string or a list of tokenLists
      var self = this;
      if (typeof subphrases === 'string') {
        self.getMatches(subphrases, self.addItems, self);
      } else if (subphrases instanceof Array) {
        var startTimeout = 0;
        _.each(subphrases, function(tokenList){
          startTimeout = startTimeout + 10;
          var qString = tokenList.join(' ');
          // set a litte timeout on these so the TM doesn't get slammed
          $timeout(function(){self.getMatches(qString, self.addItems, self)}, startTimeout);
        });
      }
    }
  }

}]);
