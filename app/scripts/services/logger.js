
// the logger should log things that are NOT directly available in the XLIFF
// the logger service also renders the json to the user
// the rendered json is always in sync with the server

// segments: [ {id: <id
angular.module('services')
.factory('Logger', ['Document', '$rootScope', '$log', function(Document, $rootScope, $log) {

    // an api to allow add, delete, update segment
    // segment completion is implicit in the data

    // Initialize with the source, hypothesis, and update when the user presses "complete"
    // TODO: how are editing phases captured in the XLIFF standard?

    // to initialize the logger when a new XLIFF document loads
    $rootScope.$on('document-loaded', function(e) {
      $log.log('LOGGER INITIALIZED');
      angular.forEach(_.zip(Document.sourceSegments, Document.targetSegments, new Array(Document.sourceSegments.length)),
        function(tuple) {
          // the final field should be empty before the user starts editing
          Log.initSegment(tuple[0], tuple[1], '');
        });
    });

    var Log = {
      segments: [],
      initSegment: function (source, hyp, final) {
        this.segments.push( { source: source, hypothesis: hyp, final: final })
      }
    }

    // a function to let the user download json
    return {
      Log: Log,
      exportJSON: function () {
        // pretty stringify with indent = 2
        var out = JSON.stringify(this.Log.segments, undefined, 2);
        return out;
      }

    }



}]);
