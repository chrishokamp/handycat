// A Document Service which manages syncing with the server
// TODO: create a segment object model - i.e. "bilingualPhrase"
// TODO: the document object should be a readable and writable interface to the xliff DOM

// properties = { segments: <numSegments>, docTree: { <documentObject> } }

angular.module('services').factory('Document', function( ) {

  // Working - functions to update, delete, and modify nodes in the XLIFF



  return {
    ready: false,
    sourceSegments: [],
    targetSegments: [],
    // testing: these are pairs of source + target
    segments: [],
    translatableNodes: [],
    sourceLang: '',
    targetLang: '',
    DOM: {}
  }
});
