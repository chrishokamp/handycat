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
        var self = this;
        var xml = parser.parseFromString(rawText, "text/xml");
        // Set Document DOM to the parsed result
        Document.DOM = xml;

        var file = xml.querySelector("file");

        // get all <trans-unit> nodes
        var transUnits = xml.querySelectorAll('trans-unit');

        // Note: the Escriba sample xliffs have MT output inside them, ready for post-editing
        var sourceSegments = this.getTranslatableSegments(xml);

        // for every segment, get its matching target mrk, if it exists - note: it may not exist
        var targetSegments = _.map(sourceSegments,
          function(seg) {
            return self.getMrkTarget(xml, seg);
          }
        );

        $log.log("the number of source segments is: " + sourceSegments.length);
        $log.log("The number of target segments is: " + targetSegments.length);

        var sourceWithTarget = _.zip(sourceSegments, targetSegments);
        _.each(sourceWithTarget,
          function(seg) {
            var sourceText = seg[0].textContent;
            var targetText = seg[1] ? seg[1].textContent : '';
            $log.log("sourceText: " + sourceText)
            $log.log("targetText: " + targetText)
            var segPair = [sourceText, targetText];

            // TODO how to replace and add nodes to the document as the translator works?
            Document.sourceSegments.push(sourceText);
            Document.targetSegments.push(targetText);
            // Add the pairs so we can access both sides from a single ngRepeat
            Document.segments.push(segPair);

            // TODO: make this useful
            Document.translatableNodes.push(seg);
          });
        // tell the world that the document loaded
        $log.log("firing DocumentLoaded");
        $rootScope.$broadcast('DocumentLoaded');
        // flip the flag on the Document object
        Document.loaded = true;
      },
      getTranslatableSegments: function(xmlDoc) {
        return xmlDoc.querySelectorAll('seg-source > mrk[mtype="seg"]');
      },
      getMrkTarget: function(xmlDoc, seg) {
        var segid = this.getSegId(seg);
        var tuid = this.getTransUnitId(seg);
        return xmlDoc.querySelector('trans-unit[id="'+tuid+'"] > target > mrk[mtype="seg"][mid="'+segid+'"]');
      },
      getSegId: function(seg) {
        return seg.getAttribute("mid");
      },
      getTransUnitId: function(seg) {
        var transunitNode = seg.parentNode.parentNode;
        return transunitNode.getAttribute("id");
      },
      // utility function to grab a local file from a string url
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