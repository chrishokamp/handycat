// A Document Service which manages syncing with the server
// TODO: create a segment object model - i.e. "bilingualPhrase"
// TODO: the document object should be a readable and writable interface to the xliff DOM

// properties = { segments: <numSegments>, docTree: { <documentObject> } }

angular.module('services').factory('Document',['$log', function($log) {

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
      var domString = new XMLSerializer().serializeToString( this.DOM );
      return domString;
    },

    init: function() {
      var self = this;
      self.ready = false;
      self.loaded = false;
      self.revision = undefined;
      self.sourceSegments = [];
      self.targetSegments = [];
      self.segments = [];
      self.translatableNodes = [];
      self.sourceLang = '';
      self.targetLang = '';
      self.DOM = {};
      self.completedSegments = [];
    }
  }
}]);

