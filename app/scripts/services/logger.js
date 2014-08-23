// the logger should log things that are NOT directly available in the XLIFF
// the logger service also renders the json to the user
// the rendered json is always in sync with the server

// segments: [ {id: <id>, source: <source>, hyp: <hypothesis>, final: <post-edited revision> } ]
angular.module('services')
.factory('Logger', ['Document', '$rootScope', '$log', function(Document, $rootScope, $log) {

    // an api to allow add, delete, update segment
    // segment completion is implicit in the data

    // Initialize with the source, hypothesis, and update when the user presses "complete"
    // TODO: how are the different editing phases captured in the XLIFF standard?
    // WORKING: how do we capture and save the state of segments?
    // This is a big design decision which relies on degree to which we want to be dependent upon the XLIFF standard
    // The design decision is whether to stick with XLIFF, or to design our own persistence model
    // Question 1: does XLIFF even provide for the option to save both the original hypothesis, and the post-edited version?
    // Question 2: Post-editing is different than translating from scratch -- if the user didn't post edit, the logs may not help nearly as much
    // Sticking with XLIFF, and writing in- out- converters would be the industry and standard guys' preference
    // How much more work will this be than creating an application-specific persistence format?

    // to initialize the logger when a new XLIFF document loads
    $rootScope.$on('document-loaded', function(e) {
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
