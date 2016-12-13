// the logger should log things that are NOT directly available in the XLIFF
// the logger service also renders the json to the user
// the rendered json is always in sync with the server

// segments: [ {id: <id>, source: <source>, hyp: <hypothesis>, final: <post-edited revision> } ]
// This service currently serves as the XLIFF2JSON converter
angular.module('services')
.factory('Logger', ['$rootScope', '$log', function($rootScope, $log) {

    // segment completion is implicit in the data (if the 'final' field is different from hyp, the segment has been edited)

    // Initialize with the source, hypothesis, and update when the user presses "complete"
    // TODO: how are the different editing phases captured in the XLIFF standard?
    // WORKING: how do we capture and save the state of segments?
    //    UPDATE: in the <alt-trans> tag, there is support for { accepted | rejected | ... }
    // This is a big design decision which relies on degree to which we want to be dependent upon the XLIFF standard
    // The design decision is whether to stick with XLIFF, or to design our own persistence model
    // Question 1: does XLIFF even provide for the option to save both the original hypothesis, and the post-edited version?
    // Question 2: Post-editing is different than translating from scratch -- if the user didn't post edit, the logs may not help nearly as much
    // Sticking with XLIFF, and writing in- out- converters would be the industry and standard guys' preference
    // How much more work will this be than creating an application-specific persistence format?
    // TODO: what are the critical parsers that we certainly need?
    // txt - line by line
    // txt with ||| separator

    //TODO: add header with user information to the log
    var Log = {
      document: {}
    }

    // a function to let the user download json
    return {
      log: Log,
      addEvent: function(documentId, segmentId, logData) {
        if (!(documentId in this.log.document)) {
          this.log.document[documentId] = {segments: {}}
        }
        if (!(segmentId in this.log.document[documentId].segments)) {
          this.log.document[documentId].segments[segmentId] = [];
        }
        this.log.document[documentId].segments[segmentId].push(logData);
      },
      exportJSON: function () {
        // pretty stringify with indent = 2
        var out = JSON.stringify(this.log, undefined, 2);
        return out;
      }
    }
}])
