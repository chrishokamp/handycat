'use strict';

// this service wraps the fileReader (fileReader implementation is done with promises)
// TODO: we need a service representing the XLIFF DOM at all times
// TODO: this service should be merged with the Document service

define(['services/services'], function(services) {

  services.factory('XliffParser', ['$rootScope','fileReader','Document','$http', '$log', function( $rootScope,fileReader,Document,$http,$log ) {
    // Persistent DOMParser
    var parser = new DOMParser();

    // Working - we want to be able to load a file automatically (for development and testing


    return {
      // call file reader, then parse the result as XML

// Only allow non-Upload controllers to touch this object once the file has loaded and parsed
// Broadcast the "file loaded" event? -- that's probably the best way
      readFile: function(file) {
        $log.log("inside parse");
        var promise = fileReader.readAsText(file);
        promise.then(function(result) {
          this.parseXML(result);
        });
      },
      parseXML: function(rawText) {
          var xml = parser.parseFromString(rawText, "text/xml");
          // Set Document DOM to the parsed result
          Document.DOM = xml;

          var file = xml.querySelector("file");

          // get all <trans-unit> nodes
          var transUnits = xml.querySelectorAll('trans-unit');

          var segments = get_translatable_segments(xml);
          $log.log("The number of segments is: " + segments.length);

          _.each(segments,
            function(seg) {
              var s = seg.textContent;
              // TODO how to replace and add nodes to the document as the translator works?
              Document.segments.push(seg.textContent);
              Document.translatableNodes.push(seg);
            });
          // tell the world that the document loaded
          $log.log("firing DocumentLoaded");
          $rootScope.$broadcast('DocumentLoaded');
          // flip the flag on the Document object
          Document.loaded = true;
      },
      // Copied from Escriba - utility method to grab a local file from a string url
      loadLocalFile: function(filepath) {
        // if filepath exists
        var xliffFile = '';
        if (filepath) xliffFile = filepath;

        var self = this;
        //This will make the request, then call the parser and fire the document loaded event
        $http.get(xliffFile)
          .success(function(data) {
            //$log.log("Local File Data: " + data); // tested
            self.parseXML(data);
          });
      }
    }
  }]);
});