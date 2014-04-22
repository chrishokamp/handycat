// this service wraps the fileReader (fileReader implementation is done with promises)
// TODO: we need a service representing the XLIFF DOM at all times
// TODO: this service should be merged with the Document service

angular.module('services').factory('XliffParser', ['$rootScope','fileReader','Document','$http', '$log', function( $rootScope,fileReader,Document,$http,$log ) {
  // Persistent DOMParser
  var parser = new DOMParser();

  return {
    // call file reader, then parse the result as XML

// Only allow non-Upload controllers to touch this object once the file has loaded and parsed
// Broadcast the "file loaded" event? -- that's probably the best way
    readFile: function(file) {
      var self = this;
      $log.log("inside parse");

      var promise = fileReader.readAsText(file);
      promise.then(function(result) {
        self.parseXML(result);
      });
    },
    parseXML: function(rawText) {
      var self = this;
      var xml = parser.parseFromString(rawText, "text/xml");
      // Set Document DOM to the parsed result
      Document.DOM = xml;

      var file = xml.querySelector("file");

      var sourceLang = file.getAttribute('source-language');
      var targetLang = file.getAttribute('target-language');

      // WORKING - support other tags which may contain translatable units
      // Working - get all <trans-unit> nodes
      var transUnits = xml.querySelectorAll('trans-unit');
      // this requires adhering to the XLIFF spec

      var sourceSegments = this.getTranslatableSegments(xml);

      // for every segment, get its matching target mrk, if it exists - note: it may not exist
      var targetSegments = _.map(sourceSegments,
        function(seg) {
          return self.getMrkTarget(xml, seg);
        }
      );

      $log.log("the number of source segments is: " + sourceSegments.length);
      $log.log('source lang: ' + sourceLang);
      $log.log("The number of target segments is: " + targetSegments.length);
      $log.log('target lang: ' + targetLang);

      var sourceWithTarget = _.zip(sourceSegments, targetSegments);
      _.each(sourceWithTarget,
        function(seg) {
          var sourceText = seg[0].textContent;
          var targetText = seg[1] ? seg[1].textContent : '';
          $log.log("sourceText: " + sourceText);
          $log.log("targetText: " + targetText);
          $log.log("sourceDOM: " + seg[0]);
          $log.log("targetDOM: " + seg[1]? seg[1] : '');
          // TODO(ximo) if seg[1] does not exist, create and add to DOM
          var segPair = {
            source: sourceText,
            target: targetText,
            sourceDOM: seg[0],
            targetDOM: seg[1]
          };

          // TODO how to replace and add nodes to the document as the translator works?
          Document.sourceSegments.push(sourceText);
          Document.targetSegments.push(targetText);
          // Add the pairs so we can access both sides from a single ngRepeat
          Document.segments.push(segPair);

          // TODO: make this useful
          Document.translatableNodes.push(seg);

          Document.sourceLang = sourceLang;
          Document.targetLang = targetLang;
        });
      // tell the world that the document loaded
      $log.log("firing document-loaded");
      $rootScope.$broadcast('document-loaded');
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
