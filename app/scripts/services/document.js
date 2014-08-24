// A Document Service which manages syncing with the server
// TODO: create a segment object model - i.e. "bilingualPhrase"
// TODO: the document object should be a readable and writable interface to the xliff DOM

// properties = { segments: <numSegments>, docTree: { <documentObject> } }

angular.module('services').factory('Document', function( ) {

  // Working - functions to update, delete, and modify nodes in the XLIFF
  return {
    ready: false,
    loaded: false,
    revision: undefined,
    sourceSegments: [],
    targetSegments: [],
    // testing: these are pairs of source + target
    segments: [],
    translatableNodes: [],
    sourceLang: '',
    targetLang: '',

    // The stringified DOM is what we want to pass back and forth to the server
    DOM: {},

    completedSegments:[],

    getDOMString: function () {
      return new XMLSerializer().serializeToString( Document.DOM );
    },

    init: function() {
      var self = this;
      self.ready = false;
      self.loaded = false;
      self.revision = undefined;
      self.sourceSegments.length = 0;
      self.targetSegments.length = 0;
      self.segments.length = 0;
      self.translatableNodes.length = 0;
      self.sourceLang = '';
      self.targetLang = '';
      self.DOM = {};
      self.completedSegments.length = 0;
    }
  }
});

