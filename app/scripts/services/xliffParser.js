'use strict';

// this service wraps the fileReader (fileReader implementation is done with promises)
// TODO: we need a service representing the XLIFF DOM at all times

define(['services/services'], function(services) {

  services.factory('XliffParser', ['$rootScope','fileReader','Document', function( $rootScope,fileReader,Document ) {
    // Persistent DOMParser
    var parser = new DOMParser();
    return {
      // call file reader, then parse the result as XML
      // NOTE: we don't pass in scope anymore!
// TODO: set flags indicating that parsing has finished
// Only allow non-Upload controllers to touch this object once the file has loaded and parsed
// Broadcast the "file loaded" event? -- that's probably the best way
      parse: function(file) {
        var promise = fileReader.readAsText(file);
        promise.then(function(result) {
          var xml = parser.parseFromString(result, "text/xml");
          var file = xml.querySelector("file");
          var segments = get_translatable_segments(xml);
          //d("the result from xliff parser:");
          //d(result);

          _.each(segments,
            function(seg) {
              var s = seg.textContent;
              // TODO how to replace and add nodes to the document as the translator works?
              Document.segments.push(seg.textContent);
              Document.translatableNodes.push(seg);
            });
          // tell the world that the document loaded
          $rootScope.$broadcast('DocumentLoaded');
        });


      }
    }


  }]);
});