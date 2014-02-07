'use strict';

define(['controllers/controllers'], function(controllers) {

  controllers.controller('AceCtrl', ['$scope', 'Document', 'TranslationMemory', 'tokenizer', '$log', function($scope, Document, TranslationMemory, tokenizer, $log) {

    $scope.fullDoc = Document;

    $scope.setModel = function(index) {
      var segName = seg + index;
      $scope.segName = $scope.segments[index];
      return segName;
    }


    // TM returns a list of objects like this:
//      quality: 100
//      rank: 100
//      source: "apple"
//      target: "Apfel"

    // TODO: source controller and directive to let us flip through source tokens
    // maintain the current TM matches based on the selected token in the source side
    // also let user search for arbitrary TM matches
    // $scope.sampleSen = "You're really nice, and you'd always help me.";
    $scope.sampleSen = "Check the file for code programs.";
    $scope.minPhraseLen = 2;
    $scope.createTM = function(str, minPhraseLen) {
      var toks = tokenizer.tokenize(str);
      var subphrases = tokenizer.subphrases(toks,minPhraseLen);
      $log.log("the subphrases: " + JSON.stringify(subphrases));
      // populate the TM with the segments from this AceCtrl instance
      TranslationMemory.populateTM(subphrases);
    }

    $scope.logTM = function() {
      $log.log("the TM: " + JSON.stringify(TranslationMemory.TM));
    }

    $scope.setText = function(text) {
      var editor = $scope.editor;
      if (editor) {
        editor.setValue(text);
      }
    };

    // TM testing section
    $scope.testQuery = 'document';
    $scope.testQuery = 'computer';
    //$scope.testQuery = 'apple';
    $scope.queryTM = function(query) {
      // pass in the query and the callback
      TranslationMemory.getMatches(query, populateTM);
    }
    // End TM testing section

    // TODO: this only works when the editor's aceLoaded event has fired
    $scope.getSelection = function() {
      var editor = $scope.editor;
      if (editor) {
        // log the text
        console.log($scope.editor.session.getTextRange(editor.getSelectionRange()));

        // Set the selection on the scope
        $scope.currentSelection = $scope.editor.session.getTextRange(editor.getSelectionRange());

        //get selection range
        var r = editor.getSelectionRange();

        // Now add some markup to this text
        //add marker
        var session = editor.session;
        r.start = session.doc.createAnchor(r.start);
        r.end = session.doc.createAnchor(r.end);

        //r.id = session.addMarker(r, "ace_step", "text")

        // the last argument tells us whether to put the marker in front of the text or behind it
        // true = in front, false = behind
        // there are two marker layers
        r.id = session.addMarker(r, "was-selected", "text", false);

        // WORKING: use the built-in drag-drop implementation for now

      } else {
        d("ERROR: no editor on the scope!");
      }
    }

    $scope.insertText = function(text) {
      var editor = $scope.editor;
      editor.insert(text);
    }

    $scope.currentPrefix = function() {
      var editor = $scope.editor;
      console.log(editor.getValue());
    }

    // TESTING TYPEAHEAD
    $scope.selected = undefined;
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    // END TYPEAHEAD

    // Use this function to configure the ace editor instance
    $scope.aceLoaded = function (_editor) {
      d("inside ace loaded");

      // Setup autocompletion - TODO: in progress
      // Note: this is the path for the ace require modules
      var langTools = ace.require("ace/ext/language_tools");
      //$log.log(langTools);

      var editor = ace.edit("editor");
      editor.setOptions({enableBasicAutocompletion: true});
      // uses http://rhymebrain.com/api.html
      var rhymeCompleter = {
          getCompletions: function(editor, session, pos, prefix, callback) {
              if (prefix.length === 0) { callback(null, []); return }
              $.getJSON(
                  "http://rhymebrain.com/talk?function=getRhymes&word=" + prefix,
                  function(wordList) {
                      // wordList like [{"word":"flow","freq":24,"score":300,"flags":"bc","syllables":"1"}]
                      callback(null, wordList.map(function(ea) {
                          return {name: ea.word, value: ea.word, score: ea.score, meta: "rhyme"}
                      }));
                  })
          }
      }

      langTools.addCompleter(rhymeCompleter);      // TODO: add the typeahead controller code
      // end autocompletion tests

      var editor = ace.edit("editor");

      var editor = _editor;
      // Testing ace autocompletion

      $scope.editor = editor;
      var session = editor.getSession();

      // TESTING TO FIND HOW ACE USES ITS CONTAINER ELEMENT
      d("Logging the renderer");
      var renderer = editor.renderer;
      var container = renderer.getContainerElement();
      d(container);
      // END TESTING

      // hide the print margin
      editor.setShowPrintMargin(false);
      // wrap words
      session.setUseWrapMode(true);

      // TESTING: dynamically set the mode
      $scope.setMode = function() {
        var modeName = "text";
        session.setMode('ace/mode/' + modeName);
      }

      // TODO: how to limit the Ace editor to a certain number of lines?
      // TODO: Override pressing Enter when inside an edit area? - i.e. don't let Ace see it
      //editor.setOption("maxLines", 1);
      //editor.setOptions({
      //  maxLines: 1
      //});

      $scope.startText = "gloss over source to see the target phrase alignment";
// TODO: see moses - how to get translation alignment?
      editor.setFontSize(20);
      editor.setFontSize(20);
      //editor.setValue($scope.startText);
      //editor.setTheme("ace/theme/twilight");  // Note: the editor themes are called by their string names (these are not paths)
      //console.log(_renderer.getTheme());

      var renderer = editor.renderer;
      //session.on("change", function(){
        //console.log(editor.getValue());
       //console.log("the ace session change event fired") });
    }

  }]);
});

