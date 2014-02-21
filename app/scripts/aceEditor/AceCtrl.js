// TODO: source controller and directive to let us flip through source tokens
// maintain the current TM matches based on the selected token in the source side

angular.module('controllers').controller('AceCtrl',
  ['$scope', 'Document', 'TranslationMemory', 'tokenizer', 'Glossary', 'GermanStemmer', '$http','$timeout', '$log', function($scope, Document, TranslationMemory, tokenizer, Glossary, GermanStemmer, $http, $timeout, $log) {

  // require some stuff from the ace object
  var aceRange = ace.require('ace/range').Range;

  // testing the special chars directive
  $scope.germanChars = ['ä','ö','ü','Ä','Ö','Ü','ß'];
  $scope.insertChar = function(char) {
    $log.log("char to insert: " + char);
    $scope.insertText(char);
  }

  // we don't know ths segment's value until it's initialized from the ng-repeat index
  // TODO: use ngInit to set the source and target segs from the view?
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

  // TODO: the logic here is wrong -- the tokenizer produces WAY too many queries!
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

  // set the text for this editor instance
  $scope.setText = function(text) {
    var editor = $scope.editor;
    if (editor) {
      editor.setValue(text);
    }
  };

  // get the current selection from the editor
  var getSelection = function() {
    var editor = $scope.editor;
    //get selection range
    return editor.getSelectionRange();;
  }

  var selectRange = function(aceRange) {
    $scope.editor.session.selection.setRange(aceRange);
  }

  // get the range of the current token under the cursor
  // Chris: working here - call this as part of the selection workflow, when tokens need to be selected or reselected
  var getCurrentTokenRange = function() {
    var editor = $scope.editor;
    // get cursor position, then token
    var pos = editor.getCursorPosition();
    $log.log('current cursor position: ');
    $log.log(pos);
    var token = editor.session.getTokenAt(pos.row, pos.column);
    $log.log("LOG: token object is: ");
    $log.log(token);

    var tokenRange = new aceRange(pos.row, token.start, pos.row, token.start + token.value.length);
    $log.log("logging the tokens range");
    $log.log(tokenRange)

    // editor.session.selection.setRange(tokenRange);
  }

  // replace the current selection in the editor with this text
  $scope.replaceSelection = function(text) {
    var editor = $scope.editor;
    var currentSelection = getSelection();
    $log.log(currentSelection);

    // use the replace method on the ace Document object
    editor.session.getDocument().replace(currentSelection, text);
    $log.log("replaced current selection with: " + text);

    // refocus the AceEditor
    $scope.editor.focus();
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
    // WORKING - use ace.require to create an edit mode - in lib/

    $scope.editor.session.setMode('ace/mode/text');

    // Testing token mouseover
    editor.on('click', function(e) {
      // testing only
      getCurrentTokenRange();

      var position = e.getDocumentPosition();
      var token = editor.session.getTokenAt(position.row, position.column);
      $log.log("LOG: token object is: ");
      $log.log(token);

      $log.log("LOG: Stemmed token is: ");
      var stemmedToken = GermanStemmer.stem(token.value)
      $log.log(stemmedToken);

      $log.log("map output is: ");
      var otherForms = GermanStemmer.getOtherForms(stemmedToken)
      $log.log(otherForms);

      // now select token (first clear any existing selection)
       // editor.session.removeMarker(markerId)
      var tokenRange = new aceRange(position.row, token.start, position.row, token.start + token.value.length);
      $log.log("logging the tokens range");
      $log.log(tokenRange)

      // we currently don't need to use clearSelection(), but switching to multi-select may require that

      editor.session.selection.setRange(tokenRange);

      //TODO - move to a directive for wordForms?
      if (otherForms) {
        $log.log("setting otherWordForms");
        $scope.otherWordForms = otherForms;
        $scope.$apply();
      }
    });

    // a way of getting the current token on click
//      var Range = ace.require("ace/range").Range, markerId
//      var handler = function(e){
//          var editor = e.editor
//          console.log(e)
//          var pos = editor.getCursorPosition()
//          var token = editor.session.getTokenAt(pos.row, pos.column)
//          if (/\bkeyword\b/.test(token.type))
//              console.log(token.value, 'is a keyword')
//
//          // add highlight for the clicked token
//          var range = new Range(pos.row, token.start,
//              pos.row, token.start + token.value.length)
//          console.log(range)
//          editor.session.removeMarker(markerId)
//          markerId = editor.session.addMarker(range, 'ace_bracket red')
//      }
//      editor.on("click", handler)

    // TESTING - focus the editor
    // what is the editor object?
    //$log.log(editor);

    // TESTING: set the content of the editor as the target segment
    //$log.log("setting the value of the ace editor to: " + $scope.targetSegment);
    //editor.setValue($scope.targetSegment);

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
    var glossaryCompleter = {
      getCompletions: function(editor, session, pos, prefix, callback) {
        if (prefix.length === 0) { callback(null, []); return }
        var glossaryMatches = Glossary.allWords;
        callback(null, glossaryMatches.map(function(item) {
          return {name: item, value: item, score: 1, meta: "Glossary"}
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
    langTools.addCompleter(tmCompleter);   // TODO: add the typeahead controller code
    langTools.addCompleter(glossaryCompleter);
    // end autocompletion tests

    var session = editor.session;
    // modify some of the display params for the Ace Editor
    var renderer = editor.renderer;
    //var container = renderer.getContainerElement();
    renderer.setShowGutter(false);
    //renderer.setPadding(10)
    // hide the print margin
    editor.setShowPrintMargin(false);
    renderer.setScrollMargin(10,0,0,0);

    // wrap words
    session.setUseWrapMode(true);

    // TESTING: dynamically set the mode
    // WORKING: add a text tokenization (word recognition) mode to ace
    $scope.setMode = function() {
      var modeName = "text";
      $scope.editor.session.setMode('ace/mode/' + modeName);
      $log.log("Set mode to: " + modeName);
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

