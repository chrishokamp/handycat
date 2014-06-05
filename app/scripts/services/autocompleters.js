angular.module('services')
.factory('autocompleters', ['$log', function($log) {

    var tmCompleter = {
      getCompletions: function(editor, session, pos, prefix, callback) {
        if (prefix.length === 0) { callback(null, []); return }

        // TODO: the TM needs to search for matches, not just return everything!
        var tmMatches = TranslationMemory.allMatches;
        // hit api here, and pass this function as the callback to the api
        callback(null, tmMatches.map(function(ea) {
          $log.log("inside autocomplete callback, item from TM is: ");
          $log.log(ea);
          //return {name: ea.source, value: ea.source, score: ea.quality, meta: "translation_memory"}
          return {name: ea.source, value: ea.target, score: 1, meta: "translation_memory"}

        }));
      }
    };


    var glossaryCompleter = {
      getCompletions: function(editor, session, pos, prefix, callback) {
        if (prefix.length === 0) { callback(null, []); return }
// TODO: the Glossary needs to search for matches, not just return everything!
        var glossaryMatches = Glossary.getMatches(prefix, callback);
        callback(null, glossaryMatches.map(function(item) {
          return {name: item, value: item, score: 1, meta: "Glossary"}
        }));
      }
    };

// TODO: this is a general-purpose utility that can be used to add autocomplete for any web service
//          getCompletions: function(editor, session, pos, prefix, callback) {
//            if (prefix.length === 0) { callback(null, []); return }
// WORKING: query the local tm, let this code interact with a dictionary api or concordancer?
//            $http.get('http://localhost:8999/tmserver/en/de/unit/' + prefix)
//              .success(
//                function(tmMatches) {
                // TM returns a list of objects like this: { quality: 100, rank: 100, source: "apple", target: "Apfel" }
// TODO: check how the ace's language_tools actually uses the word objects
// TODO: user will be typing in target language, so the autocomplete should have keys in the target language
//                  callback(null, tmMatches.map(function(ea) {
//                    $log.log("inside autocomplete callback, item from TM is: ");
//                    $log.log(ea);
//                    //return {name: ea.source, value: ea.source, score: ea.quality, meta: "translation_memory"}
//                    return {name: ea.source, value: ea.target, score: 1, meta: "translation_memory"}
//                  }));
//              })
//          }
//      }
}]);
