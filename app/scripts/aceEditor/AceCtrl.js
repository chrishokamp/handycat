// TODO: source controller and directive to let us flip through source tokens
// maintain the current TM matches based on the selected token in the source side

angular.module('controllers').controller('AceCtrl',
  ['$scope', 'Document', 'TranslationMemory', 'tokenizer', 'Glossary', 'GermanStemmer', '$http','$timeout', '$log', function($scope, Document, TranslationMemory, tokenizer, Glossary, GermanStemmer, $http, $timeout, $log) {

  // require some stuff from the ace object
  var aceRange = ace.require('ace/range').Range;

  // $scope.allSegments = Document.segments;

  // the values for this instance set from the view with ng-init and the ng-repeat index
  $scope.setSegments = function(index) {
    $scope.sourceSegment = Document.sourceSegments[index];
    $scope.targetSegment = Document.targetSegments[index];
  }

  // TODO: the logic here is wrong -- the tokenizer produces WAY too many queries!
  // TODO: move this logic to the tokenizer
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
  var getCurrentTokenAndRange = function() {
    var editor = $scope.editor;
    // get cursor position, then token
    var pos = editor.getCursorPosition();
    var token = editor.session.getTokenAt(pos.row, pos.column);
    var tokenRange = new aceRange(pos.row, token.start, pos.row, token.start + token.value.length);
    return {token: token, range: tokenRange};
  }

  // replace the current selection in the editor with this text
  $scope.replaceSelection = function(text) {

    var editor = $scope.editor;
    var currentSelection = getSelection();

    // use the replace method on the ace Document object
    editor.session.getDocument().replace(currentSelection, text);
    $log.log("replaced current selection with: " + text);

    // refocus the AceEditor
    $scope.editor.focus();
  }
  // let the parent see replaceSelection too
  $scope.$parent.replaceSelection = $scope.replaceSelection;

  $scope.insertText = function(text) {
    $log.log('insertText called with value: ' + text);
    var editor = $scope.editor;

    // insert the text with a space before and after
    editor.insert(' ' + text + ' ');
  }
  // let the $parent controller see insertText, so that we can hit it from sibling controllers
  $scope.$parent.insertText = $scope.insertText;

  // The Segment area is the parent of the AceCtrl
  $scope.$on('clear-editor', function(e) {
    e.preventDefault();
    clearEditor();
  });

  function clearEditor() {
    $log.log('clearEditor fired...');
    $scope.editor.setValue(' ', -1);
    $scope.editor.focus();
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
  $scope.aceLoaded = function (editor) {
   var editor = editor;
   $scope.editor = editor;


    // Note: this is the path for the ace require modules
    var langTools = ace.require("ace/ext/language_tools");
    $scope.editor = editor;

    $scope.editor.session.setMode('ace/mode/text');

    // Testing token mouseover
    editor.on('click', function(e) {

// TODO: move this side-effect elsewhere
    $scope.$parent.$apply(
      function() {
        $scope.$parent.toggleToolbar(false);
      }
    );

    var tokenAndRange = getCurrentTokenAndRange();
    var token = tokenAndRange.token;
    var stemmedToken = GermanStemmer.stem(token.value);
    $log.log('token: '+ token, 'stemmed: ' + stemmedToken);

    // TODO: move this out of AceCtrl - function is on segmentCtrl
    $scope.$parent.$apply(
      function() {
        $scope.getOtherWordForms(stemmedToken);
      }
    );

    // now select token (first clear any existing selection)
    editor.session.selection.setRange(tokenAndRange.range);
    // we currently don't need to use clearSelection(), but switching to multi-select may require that
   });

// Chris: use the function below to highlight the search term in the text
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
//
//          // Chris - ace_bracket would be the css class
//          markerId = editor.session.addMarker(range, 'ace_bracket red')
//      }
//      editor.on("click", handler)

    editor.setOptions({enableBasicAutocompletion: true});
    var tmCompleter = {
      getCompletions: function(editor, session, pos, prefix, callback) {
        if (prefix.length === 0) { callback(null, []); return }

        // TODO: the TM needs to search for matches, not just return everything!
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
// TODO: the Glossary needs to search for matches, not just return everything!
        var glossaryMatches = Glossary.getMaa;
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


// Move styling into the Ace Editor directive
// TODO: see moses - how to get translation alignments?

    // this doesn't work from CSS for some reason
    editor.setFontSize(20);

    var heightUpdateFunction = function() {

      // http://stackoverflow.com/questions/11584061/
      var newHeight =
                editor.getSession().getScreenLength()
                * editor.renderer.lineHeight
                + editor.renderer.scrollBar.getWidth();

      $('#editor').height(newHeight.toString() + "px");
      $('#editor-section').height(newHeight.toString() + "px");

      // This call is required for the editor to fix all of
      // its inner structure for adapting to a change in size
      editor.resize();
    };

    heightUpdateFunction();

    // Whenever a change happens inside the ACE editor, update
    // the height again
    editor.getSession().on('change', heightUpdateFunction);
    // Set initial size to match initial content
  }  // end AceLoaded

  // BEGIN - managing the active segment
  // listen for the new segment event, if it's this segment, ask the TM for matches
  // TODO: the query logic for the tokenizer is currently flawed -- way too many queries get produced (see augmentTM)
  // also, focus the editor
  $scope.$on('changeSegment', function(e,data) {
    $log.log('Heard changeSegment, my index is: ' + $scope.index);
    $log.log('Data.currentSegment is: ' + data.currentSegment);
    if (data.currentSegment === $scope.index) {
      // ask the TM
//      $log.log('augmenting the TM for seg index: ' + $scope.index);
//      $scope.augmentTM($scope.minPhraseLen);
      $log.log("focusing the editor for segment: " + data.currentSegment);
      $scope.editor.focus();
      var containerEditArea = $($scope.editor.container).parents('.segment');
      $log.log('parent segment element: ');
      $log.log(containerEditArea);
// TODO: this only works for large displays, otherwise the offset is wrong
      $(window).scrollTop($(containerEditArea).offset().top);
    }
  });

  $scope.segmentFinished = function() {
    var segId = $scope.index;

    $log.log("segId is: " + segId);
    $log.log("emitting segmentComplete");
    $scope.$emit('segmentComplete', {segmentId: segId});
  }

}]);

