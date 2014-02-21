// A Document Service which manages syncing with the server
// TODO: create a segment object model - i.e. "bilingualPhrase"
// TODO: the document object should be a readable and writable interface to the xliff DOM

// properties = { segments: <numSegments>, docTree: { <documentObject> } }

angular.module('services').factory('Document', function( ) {
  // TODO: how to get a "loaded" flag on this object? - emit an event?
  return {
    ready: false,
    sourceSegments: [],
    targetSegments: [],
    // testing: these are pairs of source + target
    segments: [],
    translatableNodes: [],
    DOM: {}
  }
});
