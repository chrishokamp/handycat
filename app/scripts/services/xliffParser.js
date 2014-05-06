// this service wraps the fileReader (fileReader implementation is done with promises)
// TODO: we need a service representing the XLIFF DOM at all times
// TODO: this service should be merged with the Document service

angular.module('services').factory('XliffParser', ['$rootScope','fileReader','Document','$http', '$log', function( $rootScope,fileReader,Document,$http,$log ) {
  // Persistent DOMParser
  var parser = new DOMParser();

  return {
    // call file reader, then parse the result as XML

// Only allow non-Upload controllers to touch this object once the file has been loaded and parsed
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

      // TODO: a zip won't work here, since there may be segments missing in the middle
      // we need to iterate through the source segments and add target nodes where they don't already exist
      // we can assume that translators will want to translate every segment, so there should be at least an
      // empty target node corresponding to each source node
      var sourceWithTarget = _.zip(sourceSegments, targetSegments);
      _.each(sourceWithTarget,
        function(seg) {
          var sourceText = seg[0].textContent;
          var targetText = seg[1] ? seg[1].textContent : '';
          $log.log("sourceText: " + sourceText);
          $log.log("targetText: " + targetText);
          $log.log("sourceDOM: " + seg[0]);
          // in the case that there is no target node, the test should fail
          $log.log("targetDOM: " + seg[1]? seg[1] : '');

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
      // initialize the revision property on the document object
      Document.revision = 0;
      // flip the flag on the Document object
      Document.loaded = true;
      // tell the world that the document loaded
      $log.log("firing document-loaded");
      $rootScope.$broadcast('document-loaded');
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
    getTransunit: function (xmlDoc, tuid) {
      return xmlDoc.querySelector('trans-unit[id="'+tuid+'"]');
    },
    getTarget: function (doc, seg) {
      var segid = this.getSegid(seg);
      var tuid = this.getTransUnitId(seg);
      return doc.querySelector('trans-unit[id="'+tuid+'"] > target');
    },
    // TODO: test these functions
    createNewMrkTarget: function (xmlDoc, seg, newValue, targetLang) {
      var segid = this.getSegId(seg);
      var tuid = this.getTransUnitId(seg);

      // create new mrk/target node
      var mrkTarget = xmlDoc.createElement('mrk');
      mrkTarget.setAttribute('mid', segid);
      mrkTarget.setAttribute('mtype', 'seg');
      mrkTarget.textContent = newValue;

      var targetNode = this.getTarget(doc, seg);
      if (!targetNode) {
        // There is no previous translation for this transunit
        // create new target node
        targetNode = doc.createElement('target');
        targetNode.setAttribute('xml:lang', targetLang);

        // append to specific transunit node
        var transUnit = this.getTransunit(doc, tuid);
        transUnit.appendChild(target_node);
      }

      // append  mrk_target to target node
      targetNode.appendChild(mrkTarget);

      return mrkTarget;
    },
    removeMrkTarget: function (doc, segment)  {
      var target_node = get_target(doc, segment);
      var mrk_target_to_be_removed = get_mrk_target(doc, segment);

      if (target_node && mrk_target_to_be_removed) {
        target_node.removeChild(mrk_target_to_be_removed);
        // remove target if empty
        if (target_node.childElementCount == 0)
          target_node.parentNode.removeChild(target_node);
      }
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
