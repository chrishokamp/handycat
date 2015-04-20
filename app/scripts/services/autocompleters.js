angular.module('services')
.factory('autocompleters', ['$http', '$log', 'autocompleterURLs', function($http, $log, autocompleterURLs) {

    // Working:
    // the server returns base URLs to endpoints that implement our autocomplete API
    // foreach url returned by the server, we init a new autocompleter, and push it onto this.autocompleters

    // working - utils for autocompletion
    // TODO: use the autocompleters service to resolve the autocompleters for the user
    // GET /autocompleters --
    // params that let us know what autocompleters the user has:
    // source lang
    // target lang
    // domain
    // TODO: there should be a selection dialog where the user can choose which autocompleters they want to use
    // the autocompleter selection service should be injected into this service
    // a user's autocompleters grow over time
    // as they select segments, we log: { source: source-text, target_prefix: target-text, completion: <selected unit from autocomplete> }

    var testUrl = 'http://localhost:8000/';
    var testSource = 'delicious sandwich';

    var autocompleteManager = {
      autocompleters: []
    }

    // TODO: constrain completions by source sentence (and source language!)
    // TODO: each segment should init an autocomplete function which returns an ace autocomplete function where the server call is correctly parameterized

    // Working -- change into a completer factory
    // we need to be able to provide the right data at call time
    var testAutocomplete = {
      getCompletions: function(editor, session, pos, prefix, callback) {
        if (prefix.length === 0) {
          callback(null, []);
          return
        }
        $http.get(autocompleterURLs.lmAutocompleterURL,
          {
            params: {
              prefix: prefix,
              sourceSegment: testSource
            }
          }
        )
        .success(
          function (completions) {
            callback(null, completions.map(function (ea) {
              $log.log("inside autocomplete callback, item from completer is: ");
              $log.log(ea);
              return {name: ea.completion, value: ea.completion, score: 1, meta: "test autocompleter"}
            }));
        })
      }
    }

    // WORKING -- we need to change the autocompletion API completely
    //autocompleteManager.autocompleters.push(testAutocomplete);

    // old code
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

    // old code
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

    return autocompleteManager;
}]);



    // COPIED TEXT
// This creates a custom autocomplete function for Ace! - fuckin cool
//    var keyWordCompleter = {
//    getCompletions: function(editor, session, pos, prefix, callback) {
//        var state = editor.session.getState(pos.row);
//        var completions = session.$mode.getCompletions(state, session, pos, prefix);
//        callback(null, completions);
//    }
//};

//var snippetCompleter = {
//    getCompletions: function(editor, session, pos, prefix, callback) {
//        var scope = snippetManager.$getScope(editor);
//        var snippetMap = snippetManager.snippetMap;
//        var completions = [];
//        [scope, "_"].forEach(function(scope) {
//            var snippets = snippetMap[scope] || [];
//            for (var i = snippets.length; i--;) {
//                var s = snippets[i];
//                var caption = s.name || s.tabTrigger;
//                if (!caption)
//                    continue;
//                completions.push({
//                    caption: caption,
//                    snippet: s.content,
//                    meta: s.tabTrigger && !s.name ? s.tabTrigger + "\u21E5 " : "snippet"
//                });
//            }
//        }, this);
//        callback(null, completions);
//    }
//};

//var completers = [snippetCompleter, textCompleter, keyWordCompleter];
//exports.addCompleter = function(completer) {
//    completers.push(completer);
//};

    // END COPIED TEXT

// cut and pasted from glossary.js
// TODO: move this to a separate autocomplete service
// en --> de index for Autocomplete
//  $http.get(glossaryFile)
//    .success(function(data) {
//      var lines = data.match(/[^\r\n]+/g);
//      var dictionary = _.map(lines, function(line) {
//        var units = line.split('\t');
//        var translations = units[2].split(', ');
//        return {source: units[0], pos: units[1], targets: translations};
//      });
//      // now add every target word to the autocomplete
//      _.each(dictionary, function(unit){
//        _.each(unit.targets, function(targetWord) {
//          Glossary.allWords.push(targetWord);
//        });
//      });
//
//      $log.log("dictionary object");
//      $log.log(dictionary);
//      $log.log("allWords");
//      $log.log(Glossary.allWords);
//
//    });

