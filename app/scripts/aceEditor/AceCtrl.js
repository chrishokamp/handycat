'use strict';

// TODO: source controller and directive to let us flip through source tokens
// maintain the current TM matches based on the selected token in the source side

define(['controllers/controllers'], function(controllers) {

  controllers.controller('AceCtrl', ['$scope', 'Document', 'TranslationMemory', 'tokenizer', '$http','$timeout', '$log', function($scope, Document, TranslationMemory, tokenizer, $http, $timeout, $log) {

    // we don't know ths segment's value until it's initialized from the ng-repeat index
    $scope.allSegments = Document.segments;
    // TODO: this is super hackish
    $scope.$watch(
      function() {
        return $scope.index;
      },
      function() {
          $scope.sourceSegment = Document.sourceSegments[$scope.index];
          $scope.targetSegment = Document.targetSegments[$scope.index];
      }
    );

    // $scope.focusEditor = function() {}

    $scope.setModel = function(index) {
      var segName = seg + index;
      $scope.segName = $scope.segments[index];
      return segName;
    }

    // TODO: the logic here is wrong -- the tokenizer produces WAY too many queries!
    //$scope.sampleSen = "Check the file for code programs.";
    $scope.minPhraseLen = 15;
    var tmQueried = false;
    $scope.augmentTM = function(minPhraseLen) {
      //$log.log("minPhraseLen: " + $scope.minPhraseLen);
//      $log.log("source segment: " + $scope.sourceSegment)
//      $log.log("Augmenting the TM");
      if (!tmQueried) {
        $log.log("Getting TM matches for seg: " + $scope.sourceSegment);

        // Working - take every other item
        var toks = tokenizer.tokenize($scope.sourceSegment);

        $log.log("from AceCtrl, logging toks: ");
        $log.log(toks);
        var subphrases = tokenizer.subphrases(toks,minPhraseLen);
        //$log.log("the subphrases: " + JSON.stringify(subphrases));
        // populate the TM with the segments from this AceCtrl instance
        TranslationMemory.populateTM(subphrases);
        tmQueried = true;
      } else {
        $log.log("TM already loaded for seg: " + $scope.sourceSegment);
      }
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
    // $scope.selected = undefined;
    // $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    // END TYPEAHEAD

    // Use this function to configure the ace editor instance
    $scope.aceLoaded = function (_editor) {
      // d("inside ace loaded");
      // TESTING the index directive
      $timeout(function() { $log.log("the index property on this AceEditor ctrl is: " + $scope.index)},1500);

      // Note: this is the path for the ace require modules
      var langTools = ace.require("ace/ext/language_tools");
      var editor = _editor;
      $scope.editor = editor;

      // TESTING - focus the editor
      // what is the editor object?
      //$log.log(editor);

      // TESTING: set the content of the editor as the target segment
      //$log.log("setting the value of the ace editor to: " + $scope.targetSegment);
      //editor.setValue($scope.targetSegment);

      var session = editor.getSession();

      editor.setOptions({enableBasicAutocompletion: true});
      var tmCompleter = {
        getCompletions: function(editor, session, pos, prefix, callback) {
          if (prefix.length === 0) { callback(null, []); return }
          var tmMatches = TranslationMemory.allMatches;
          callback(null, tmMatches.map(function(ea) {
            $log.log("inside autocomplete callback, item from TM is: ");
            $log.log(ea);
            //return {name: ea.source, value: ea.source, score: ea.quality, meta: "translation_memory"}
            return {name: ea.source, value: ea.target, score: 1, meta: "translation_memory"}

          }));
        }
      }
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
// This creates a custom autocomplete function for Ace! - fuckin cool
      langTools.addCompleter(tmCompleter);      // TODO: add the typeahead controller code
      // end autocompletion tests

      // TESTING TO FIND HOW ACE USES ITS CONTAINER ELEMENT
      // d("Logging the renderer");
      var renderer = editor.renderer;
      var container = renderer.getContainerElement();
      // d(container);
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

// TODO: see moses - how to get translation alignments?
      editor.setFontSize(20);
      editor.setFontSize(20);
      // sampleSen is initialized earlier in the controller
      // editor.setValue($scope.sampleSen);
      //editor.setTheme("ace/theme/twilight");  // Note: the editor themes are called by their string names (these are not paths)
      //console.log(_renderer.getTheme());

      //session.on("change", function(){
        //console.log(editor.getValue());
       //console.log("the ace session change event fired") });
    }

    // BEGIN - managing the active segment
    // listen for the new segment event, if it's this segment, ask the TM for matches
    // TODO: the query logic for the tokenizer is currently flawed -- way too many queries get produced (see augmentTM)
    // also, focus the editor
    $scope.$on('changeSegment', function(e,data) {
      $log.log('Heard changeSegment, my index is: ' + $scope.index);
      $log.log('Data.currentSegment is: ' + data.currentSegment);
      if (data.currentSegment === $scope.index) {
        // ask the TM
        $log.log('augmenting the TM for seg index: ' + $scope.index);
        $scope.augmentTM($scope.minPhraseLen);
        // $scope.editor.focus();

      }
    });

    $scope.segmentFinished = function() {
      var segId = $scope.index;

      $log.log("segId is: " + segId);
      $log.log("emitting segmentComplete");
      $scope.$emit('segmentComplete', {segmentId: segId});
    }

  }]);
});

