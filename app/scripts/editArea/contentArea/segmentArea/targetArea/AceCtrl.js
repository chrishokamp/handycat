// this is an iterface to the ace editor, but the API it exposes should be easily adaptable to other text editing components
angular.module('controllers').controller('AceCtrl',
  ['$scope', 'tokenizer', 'editSession', '$q', '$filter', '$http', 'autocompleters',
   '$timeout', '$log',
   function($scope, tokenizer, editSession, $q, $filter, $http, autocompleters, $timeout, $log) {

  // require some stuff from the ace object
  var aceRange = ace.require('ace/range').Range;
  var util = ace.require('./autocomplete/util')
  var langTools = ace.require("ace/ext/language_tools");
  // end utils for autocompletion

  // TODO: implement this stuff
  //    - the editor should listen for the 'focus' event to be $broadcast - $watching the


  // BEGIN AceEditor API

  // RESET the text for this editor instance
  var setText = function(text) {
    var editor = $scope.editor;
    if (editor) {
      editor.setValue(text);
      editor.focus();
    } else {
      throw new Error('AceCtrl: $scope.setText() was called, but there is no editor on the $scope');
    }
  };
  $scope.setText = setText;
  // override(expose) this function on parent controllers if it exists (note - the if block is for testing)
  if ($scope.shared && typeof($scope.shared) === 'object'){
    $scope.shared.setText = setText;
  }

  // insert text at the caret location
  $scope.insertText = function(text) {
    $log.log('Insert text fired');
    var editor = $scope.editor;
    editor.insert(text);
    editor.focus();
  };

  // get the text inside the editor
  $scope.getValue = function() {
    return $scope.editor.getSession().getValue();
  }

  // select a range of text in the editor
  var selectRange = function(aRange) {
    $scope.editor.session.selection.setRange(aRange);
    $scope.editor.focus();
  };

  // get the current selection from the editor
  $scope.getSelection = function() {
    var editor = $scope.editor;
    //get selection range
    return editor.getSelectionRange();
  };

  // pulse the color on change, so that it's clear where a change happened
  // the display of the marker depends upon the css for the marker class
  $scope.highlightRange = function(phraseRange) {
    var marker = $scope.editor.session.addMarker(phraseRange, 'changed_range');
    // remove the marker after a bit
    $timeout(
      function() {
        $scope.editor.getSession().removeMarker(marker);
      }, 2000);
  };

  // replace the current selection in the editor with this text
  // TODO: this function is buggy - test and fix!
  $scope.replaceSelection = function(text) {
    var editor = $scope.editor;
    var currentSelection = getSelection();

    // cursor location is in an object like: { column: 37, row: 0 }
    var newCursorLocation = editor.session.getDocument().replace(currentSelection, text);
    var newRange = new aceRange(newCursorLocation.row, newCursorLocation.column - text.length, newCursorLocation.row, newCursorLocation.column);
    // TODO: select the new replacement, or create the range that it 'will be' so that we can add classes to the newly inserted text
    // add, then remove a class from the selection range
    $scope.highlightRange(newRange);
    $scope.editor.session.selection.clearSelection();

    // refocus the AceEditor
    $scope.editor.focus();
  };

  // get the range of the current token under the cursor
  var getCurrentTokenAndRange = function() {
    var editor = $scope.editor;
    // get cursor position, then token
    var pos = editor.getCursorPosition();
    //
    var token = editor.session.getTokenAt(pos.row, pos.column);
    var tokenRange = new aceRange(pos.row, token.start, pos.row, token.start + token.value.length);
    return {token: token, range: tokenRange};
  };

  function clearEditor() {
    $scope.editor.setValue(' ', -1);
    $scope.editor.focus();
  }

  $scope.removeExtraWhitespace = function() {
    var currentText = $scope.editor.getSession().getValue();
    //punctuation
    var whitespaceRemoved = currentText.replace(/\s+([\.,])/, '$1');
    // multiple spaces
    whitespaceRemoved = whitespaceRemoved.replace(/\s+/, ' ');
    // space at the beginning
    whitespaceRemoved = whitespaceRemoved.replace(/^\s+/, '');
    // space at the end
    whitespaceRemoved = whitespaceRemoved.replace(/\s+$/, '');
    $scope.editor.getSession().setValue(whitespaceRemoved);
    $scope.editor.focus();
  };

  // TODO: move configuration of the editor outside of the AceCtrl
  // WORKING: add a text tokenization (word recognition) mode to ace
  $scope.setMode = function() {
    var modeName = "text";
    $scope.editor.session.setMode('ace/mode/' + modeName);
  };

  // maintaining the current word prefix on the editor
  $scope.currentWordPrefix = function() {
    var editor = $scope.editor;
    var session = editor.getSession();
    var pos = editor.getCursorPosition();
    var line = session.getLine(pos.row);
    var prefix = util.retrievePrecedingIdentifier(line, pos.column);

    return prefix;
  };

  $scope.overwritePrefix = function(newText) {
    var editor = $scope.editor;
    var session = editor.getSession();
    var pos = editor.getCursorPosition();
    var line = session.getLine(pos.row);
    var prefix = util.retrievePrecedingIdentifier(line, pos.column);
    // get prefix range, and replace it
//    var insertPoint =
    var prefixRange = new aceRange(pos.row, pos.column - prefix.length, pos.row, pos.column);
    var newCursorLocation = editor.session.getDocument().replace(prefixRange, newText);
    return newCursorLocation;
  }
  // The Segment area is the parent of the AceCtrl
  $scope.$on('clear-editor', function(e) {
    e.preventDefault();
    clearEditor();
  });

  // Use this function to configure the ace editor instance
  $scope.aceLoaded = function (ed) {
    console.log('Ace Loaded fired');
    var editor = ed;

    $scope.editor = editor;
    // expose getValue to the segmentArea
    $scope.$parent.getValue = $scope.editor.getValue();

    $scope.editor.session.setMode('ace/mode/text');

    // we want to always know what text the user currently has selected because some functionality may fire when the user selects something
    // TODO: change this to listen for a selection change
//    editor.on('mouseup',
//      function(e) {
//        $timeout(function() {
//          // this would only exist when the user has just selected something
//          var currentSelection = getSelection();
//          var text = editor.session.getTextRange(currentSelection);
//          // this function is on segmentAreaCtrl
//          $scope.setTextSelection(text, currentSelection);
//        }, 500);
//      }
//    );

    // it should focus if the parent scope changes activeSegment to $segId
    // TODO: change this to be databound to the activeIdx on the editArea -- everytime the active index changes, the editor should refocus
    // TODO: add the integration tests which confirm this behaviour
    $scope.$watch(function() {
      return $scope.activeSegment;
    }, function(segId) {
      if (segId == $scope.index) {
        $scope.editor.focus();
      }
    });

    // working - select the current token based on the edit mode
    // the logic here is complex -- add unit tests
    // TODO - editModes actually belong in a separate component, not in a text editor
    // TODO - each editMode should probably use a different component (at least it uses a different tokenizer/detokenizer pair)
    editor.on('click', function(e) {
      var tokenAndRange = getCurrentTokenAndRange();
      var token = tokenAndRange.token;

      // make sure the user isn't trying to click into the same token to edit it
      if ($scope.lastToken !== token) {
        $scope.lastToken = token;
//            $scope.toggleToolbar(false);
//            $scope.queryGlossary(token.value, 'deu', 'eng');
//            $scope.glossary.glossaryQuery = token.value;
      }
    });

    // enable autocompletion, and set the autocompleters from the autocompleters service
    // these functions are in: lib/ace/ext/language_tools.js
    // see lines 68-111 in autocomplete.js
    // lines 237 adds the keyboard handlers to the ace popup
    // see also:lib/ace/keyboard/keybinding.js

    editor.setOptions(
      {
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enable: true
      });

    // automatically show the autocomplete - hack from stackoverflow
    editor.commands.on("afterExec", function(e){
      if (e.command.name == "insertstring"&&/^[\w.]$/.test(e.args)) {
        editor.execCommand("startAutocomplete")
      }
    })


    // Add the users autocompleters
    autocompleters.autocompleters.forEach(
      function(autocompleteFunc) {
        langTools.addCompleter(autocompleteFunc);
      }
    )


    // modify some of the display params for the Ace Editor
    //editor.getSession().setUseWrapMode(true);
    var renderer = editor.renderer;
    renderer.setShowGutter(false);
    // hide the print margin
    editor.setShowPrintMargin(false);
    renderer.setScrollMargin(10,0,0,0);
    // wrap words
    editor.session.setUseWrapMode(true);
    // this doesn't work from CSS for some reason
    editor.setFontSize(18);

    // end modifying display params

    // TODO: move matching height to a directive
    var heightUpdateFunction = function() {

      // http://stackoverflow.com/questions/11584061/
      // add 1 to screen length to get some extra space
      //var screenLength = editor.getSession().getScreenLength();
//      screenLength += 1;
//      var newHeight =
//                screenLength
//                * editor.renderer.lineHeight
//                + editor.renderer.scrollBar.getWidth();

      // TODO: remove hard-coding here and in the heightWatcher directive
      //$scope.height.editorHeight = newHeight;
      // emit ace editor height up the scope hierarchy - height change directives listen for current-height event

      // This call is required for the editor to fix all of
      // its inner structure for adapting to a change in size
      //editor.resize();
    };

    // logging each change to the editor - TODO: should this be event based?
    // using input event instead of change since it's called with some timeout
    // used by the logger -- TODO: remove this code - a component should be unaware that it's being watched/logged
    // a logger should just watch, not interfere with the component's code
    var previousValue = '';
    editor.on('input', function() {
      var newValue= editor.getValue();
      if (newValue !== previousValue) {
        var logAction = {
          "action": "insert-text",
          "newValue": newValue,
          "previousValue": previousValue,
          "segmentId": $scope.index
        };

        //editSession.logAction(logAction);
        previousValue = newValue;
      }
    });
    editor.focus();

    // Keyboard shortcuts
    editor.commands.addCommands([{
      name: 'Finish current segment',
      bindKey: {win: 'Ctrl-Enter', mac:'Ctrl-Enter'},
      exec: function(editor, line) {
        $scope.$parent.segmentFinished($scope.$index);
      }
    }]);

  };  // end AceLoaded

// TODO: maintain the current TM matches based on the selected token in the source side
  $scope.minPhraseLen = 15;
  var tmQueried = false;
  $scope.augmentTM = function(minPhraseLen) {
    if (!tmQueried) {
      // Working - take every other item
      var toks = tokenizer.tokenize($scope.segment.source);

      var subphrases = tokenizer.subphrases(toks,minPhraseLen);
      //$log.log("the subphrases: " + JSON.stringify(subphrases));
      // populate the TM with the segments from this AceCtrl instance
      TranslationMemory.populateTM(subphrases);
      tmQueried = true;
    } else {
      $log.log("TM already loaded for seg: " + $scope.segment.source);
    }
  };

  // applying deltas
  //the applyDeltas(Object deltas) API takes an array of deltas. Changing my sample code above to editor.getSession().getDocument().applyDeltas([currentDelta]) plays back properly.

}]);

