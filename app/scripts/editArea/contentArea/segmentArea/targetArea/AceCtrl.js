
angular.module('controllers').controller('AceCtrl',
  ['$scope', 'tokenizer', 'editSession', '$q', '$filter', '$http',
   '$timeout', '$log',
   function($scope, tokenizer, editSession, $q, $filter, $http, $timeout, $log) {

   $scope.testCallback = function($item, $model, $label) {
     $log.log('Test callback called with: ');
     $log.log($item + ' ' + $model + ' ' + $label);
   }

   $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

  // use the default substring filter
  $scope.getLocation = function(val) {
    var defer = $q.defer();
  //  filter:$viewValue
    var matches = $filter('limitTo')($filter('filter')($scope.states, val), 8);
    defer.resolve(matches);

    return defer.promise;
  };
  // TODO: remove after testing

  // require some stuff from the ace object
  var aceRange = ace.require('ace/range').Range;
  var util = ace.require('./autocomplete/util')
  var langTools = ace.require("ace/ext/language_tools");

  // used by the logger -- TODO: remove this
  var previousValue = '';

  // BEGIN AceEditor API

  var selectRange = function(aRange) {
    $scope.editor.session.selection.setRange(aRange);
    $scope.editor.focus();
  };

  // RESET the text for this editor instance
  $scope.setText = function(text) {
    var editor = $scope.editor;
    if (editor) {
      editor.setValue(text);
    } else {
      throw new Error('AceCtrl: $scope.setText() was called, but there is no editor on the $scope');
    }
  };

  $scope.insertText = function(text) {
    var editor = $scope.editor;
    // TODO: separate this from insertText
//    $scope.replaceSelection(text);
    editor.focus();
  };

  // get the current selection from the editor
  $scope.getSelection = function() {
    var editor = $scope.editor;
    //get selection range
    return editor.getSelectionRange();
  };

  // pulse the color on change, so that it's clear where the change happened
  $scope.highlightRange = function(phraseRange) {
    var marker = $scope.editor.session.addMarker(phraseRange, 'changed_range');
    // remove the marker after a bit
    $timeout(
      function() {
        $scope.editor.getSession().removeMarker(marker);
      }, 2000);
  };

  // replace the current selection in the editor with this text
  // TODO: this function is buggy - fix!
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



  // let the $parent controller see insertText, so that we can hit it from sibling controllers
  $scope.$parent.insertText = $scope.insertText;
  // let the parent see replaceSelection
  $scope.$parent.replaceSelection = $scope.replaceSelection;

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

  // The Segment area is the parent of the AceCtrl
  $scope.$on('clear-editor', function(e) {
    e.preventDefault();
    clearEditor();
  });

  // it should focus if the parent scope changes activeSegment to $segId
  $scope.$watch(function() {
    return $scope.activeSegment;
  }, function(segId) {
    if (segId == $scope.index) {
      $scope.editor.focus();
    }
  });

  // Use this function to configure the ace editor instance
  $scope.aceLoaded = function (ed) {
    var editor = ed;

    $scope.editor = editor;
    // expose getValue to the segmentArea
    $scope.$parent.getValue = $scope.editor.getValue();

    $scope.editor.session.setMode('ace/mode/text');

    // we want to always know what text the user currently has selected
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

    // working - select the current token based on the edit mode
    // the logic here is complex -- add unit tests
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
    editor.setOptions({enableBasicAutocompletion: true});
// This creates a custom autocomplete function for Ace! - fuckin cool
//    langTools.addCompleter(glossaryCompleter);
    //editor.getSession().setUseWrapMode(true);

    // modify some of the display params for the Ace Editor
    var renderer = editor.renderer;
    renderer.setShowGutter(false);
    // hide the print margin
    editor.setShowPrintMargin(false);
    renderer.setScrollMargin(10,0,0,0);
    // wrap words
    editor.session.setUseWrapMode(true);
    // this doesn't work from CSS for some reason
    editor.setFontSize(18);

    // working - don't scroll - height should match the text
    var heightUpdateFunction = function() {

      // http://stackoverflow.com/questions/11584061/
      // add 1 to screen length to get some extra space
      var screenLength = editor.getSession().getScreenLength();
      screenLength += 1;
      var newHeight =
                screenLength
                * editor.renderer.lineHeight
                + editor.renderer.scrollBar.getWidth();

      // emit ace editor height up the scope hierarchy - height change directives listen for current-height event
      if (newHeight < 80) {
        newHeight = 80;
      }
      $scope.$emit('change-height', { "height": newHeight });

      // This call is required for the editor to fix all of
      // its inner structure for adapting to a change in size
      editor.resize();
    };
    // Set initial size to match initial content
    heightUpdateFunction();

    // Whenever a change happens inside the ACE editor, update
    // the height again
    // TODO: only update the height when it actually changes
    // use a directive to synchronize the heights of SourceArea and TargetArea
    editor.getSession().on('change', heightUpdateFunction);

    // logging each change to the editor - TODO: should this be event based?
    // using input event instead of change since it's called with some timeout
    editor.on('input', function() {
      var newValue= editor.getValue();
      if (newValue !== previousValue) {
        var logAction = {
          "action": "insert-text",
          "newValue": newValue,
          "previousValue": previousValue,
          "segmentId": $scope.index
        };

        editSession.logAction(logAction);
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
      var toks = tokenizer.tokenize($scope.sourceSegment);

      var subphrases = tokenizer.subphrases(toks,minPhraseLen);
      //$log.log("the subphrases: " + JSON.stringify(subphrases));
      // populate the TM with the segments from this AceCtrl instance
      TranslationMemory.populateTM(subphrases);
      tmQueried = true;
    } else {
      $log.log("TM already loaded for seg: " + $scope.sourceSegment);
    }
  };

     // logging each change to the editor
     // using input event instead of change since it's called with some timeout
//  editor.on('input', function() {
//      if (editor.session.getUndoManager().hasUndo())
//          $('#save').removeClass("disabled");
//      else
//          $('#save').addClass("disabled");
//
//  });
//
//  $('#save').on("click", function() {
//      editor.session.getUndoManager().markClean()
//  })

     // applying deltas
     //the applyDeltas(Object deltas) API takes an array of deltas. Changing my sample code above to editor.getSession().getDocument().applyDeltas([currentDelta]) plays back properly.

  // TODO: log that the user propagated the n
//  $scope.$on('propagate-action', function(event, action) {
//    if (action['operation'] == 'change-token-number') {
//      var content = $scope.editor.getValue().replace(new RegExp(action['change'][0]), action['change'][1]);
//      $scope.editor.setValue(content);
//    } else {
//      $log.log('Unknown action: ' + action['type']);
//    }
//  });

//  $scope.$on('toggleShowInvisibleChars', function(event, value) {
//    $scope.editor.setOption("showInvisibles", value);
//  });

}]);

