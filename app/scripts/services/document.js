'use strict';

// A Document Service which manages syncing with the server
// TODO: create a segment object model - i.e. "bilingualPhrase"

// properties = { segments: <numSegments>, docTree: { <documentObject> } }

define(['services/services'], function(services) {

  services.factory('Document', function( ) {
    // TODO: how to get a "loaded" flag on this object? - emit an event?
    return {
      segments: [],
      translatableNodes: []
    }
  });
});