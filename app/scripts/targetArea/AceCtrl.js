
angular.module('controllers').controller('AceCtrl',
  ['$scope', 'Document', 'tokenizer', 'Glossary', 'session', '$http',
   '$timeout', '$log', 'ruleMap',
   function($scope, Document, tokenizer, Glossary, session, $http, $timeout, $log, ruleMap) {

  // require some stuff from the ace object
  var aceRange = ace.require('ace/range').Range;
  var langTools = ace.require("ace/ext/language_tools");
  ace.require('ace/ext/spellcheck');

  var previousValue = '';

  // an object representing the current edit mode
  // params:
  // spanTokenizer - a function which returns a promise containing token ranges to select
  // selectRange - a function which takes a range as its argument - will be called by this object with a range to select
  // resolving to a list of tokens in the format - { 'token': <token>, 'start': <start_index>, 'end': <end_index> }
  var EditMode = function(spanTokenizer, selectRange) {
    return {
      // remember that tokenRanges can and will be updated asynchronously
      tokenRanges: [],
      modeName: '',
      // holds the index of the current token range
      currentRangeIndex: null,
      // TODO: implement hasRange -- see ace editor source
      // if we have a token at { column, row }, return that range, else return null
      setSpans: function(text) {
        var self = this;
        self.tokenRanges = [];
        var tokenPromise = spanTokenizer(text);
        tokenPromise.then(
          function(tokenList) {
            self.tokenRanges = _.map(tokenList, function(obj) {
              // currently we don't allow multiple rows, and we wrap the text, so the row is always = 0
              return new aceRange(0, obj.start, 0, obj.end);
            });
            // select the first of the tokenRanges - be careful - this is a side-effect
            selectRange(self.tokenRanges[0]);
            self.currentRangeIndex = 0;
              $log.log("all ranges");
        $log.log(self.tokenRanges);
          },
          function(err) {
            $log.log("ERROR: AceCtrl: there was an error getting the token ranges");
          }
        );
      },
      selectNextTokenRange: function() {
        if (this.tokenRanges[this.currentRangeIndex+1]) {
          this.currentRangeIndex += 1;
        } else {
          this.currentRangeIndex = 0;
        }
        selectRange(this.tokenRanges[this.currentRangeIndex]);
      },
      selectPrevTokenRange: function() {
        if (this.tokenRanges[this.currentRangeIndex-1]) {
          this.currentRangeIndex -= 1;
        } else {
          this.currentRangeIndex = 0;
        }
        selectRange(this.tokenRanges[this.currentRangeIndex]);
      },
      // note: inserting generally involves removing one space after, then inserting one space after at the new location
      // working - currently this function is "moveRight"
      // TODO: add a 'following whitespace' function
      moveCurrentRange: function(location) {
        var tokenText = $scope.editor.getSession().getDocument().getTextRange(this.tokenRanges[this.currentRangeIndex]);
        var startingIndex = this.currentRangeIndex;
        var nextIndex = 0;

        // working - now we increment by 1, but this should be an arbitrary index - i.e. a 'swap' instead of a 'move'
        if (this.tokenRanges[startingIndex + 1]) {
          nextIndex = startingIndex + 1;
        }

        var originalRange = this.tokenRanges[startingIndex];
        //remove the original text + 1 space
        var extendedRange = angular.extend(originalRange, extendedRange);
        extendedRange.end.column += 1;

        $scope.editor.getSession().getDocument().remove(originalRange);

        // update all of the ranges from currentIndex-nextIndex-1 - (remember the extra whitespace)
        for (var i=startingIndex; i<nextIndex; i++) {
          // move the ranges in between one slot back
          var offset = tokenText.length;
          var oldRange = this.tokenRanges[i+1];
          var updatedRange = new aceRange(0, oldRange['start']['column']-offset, 0, oldRange['end']['column']-offset);
          this.tokenRanges[i] = updatedRange;
        }

        // note that this block depends upon the updated ranges above
        var insertPosition = { "row": 0, "column":this.tokenRanges[startingIndex]['end']['column'] };
        $log.log("insert position is: ");
        $log.log(insertPosition);

        var newRange = new aceRange(0, insertPosition['column'], 0, insertPosition['column']+tokenText.length);

        // place the range in its new slot
        this.tokenRanges[nextIndex] = newRange;

        // update the edit mode state
        this.currentRangeIndex = nextIndex;

        // do the actual insertion into the editor
        // add a space after tokenText
        tokenText = tokenText + ' ';
        $scope.editor.getSession().getDocument().insert(insertPosition, tokenText);
        selectRange(newRange);

        // how to maintain the current range as its indices change?
        $scope.editor.focus();
      }
    };

    // TODO: add logic to handle preceding and trailing whitespaces correctly
    // if there's a whitespace before, leave it
    // if there's a whitespace after, delete it with the range.
    // handle insertion whitespace logic SEPARATELY
  };

  // the following functions expose control of the current mode on the $scope
  $scope.selectNextRange = function() {
    currentMode.selectNextTokenRange();
  };

  $scope.selectPrevRange = function() {
    currentMode.selectPrevTokenRange();
  };

  // the following functions expose control of the current mode on the $scope
  $scope.moveCurrentEditRange = function() {
    currentMode.moveCurrentRange(1);
  };

  // TODO: on change of content in editor, the currentMode needs to update its ranges immediately
  // select a range of text in the editor - note that this function must be declared before it is used to initialize an EditMode
  var selectRange = function(aRange) {
    $scope.editor.session.selection.setRange(aRange);
    $scope.editor.focus();
  };
  var currentMode = EditMode(tokenizer.getTokenRanges, selectRange);

  // swaps the edit mode - should be a function on the editor
  $scope.changeEditMode = function() {
    // clear existing selections
    // highlight the first token of this view
    // set state on the EditMode
    // make sure that the edit mode updates when there are changes in the UI
    // we need functions like 'put after' / 'put before'

    // initialize spans on the current editing mode
    currentMode.setSpans($scope.editor.getSession().getValue());

  };
  // end edit mode API

  // BEGIN AceEditor API

  // pulse the color on change, so that it's clear where the change happened
  $scope.highlightRange = function(phraseRange) {
    $log.log('Highlighting the range: ');
    $log.log(phraseRange);
    var marker = $scope.editor.session.addMarker(phraseRange, 'changed_range');
    // remove the marker after a bit
    $timeout(
      function() {
        $scope.editor.getSession().removeMarker(marker);
      }, 2000);
  }

  // get the current selection from the editor
  var getSelection = function() {
    var editor = $scope.editor;
    //get selection range
    return editor.getSelectionRange();
  };

  // replace the current selection in the editor with this text
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

  $scope.insertText = function(text) {
    $log.log('insertText called with value: ' + text);
    var editor = $scope.editor;
    // TODO: separate this from insertText
    $scope.replaceSelection(text);
    editor.focus();
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
    $log.log('clearEditor fired...');
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

  // TESTING: dynamically set the mode
  // WORKING: add a text tokenization (word recognition) mode to ace
  $scope.setMode = function() {
    var modeName = "text";
    $scope.editor.session.setMode('ace/mode/' + modeName);
    $log.log("Set mode to: " + modeName);
  };

  $scope.currentPrefix = function() {
    var editor = $scope.editor;
    console.log(editor.getValue());
  };

  // TODO: log that the user propagated the n
  $scope.$on('propagate-action', function(event, action) {
    if (action['operation'] == 'change-token-number') {
      var content = $scope.editor.getValue().replace(new RegExp(action['change'][0]), action['change'][1]);
      $scope.editor.setValue(content);
    } else {
      $log.log('Unknown action: ' + action['type']);
    }
  });

  // The Segment area is the parent of the AceCtrl
  $scope.$on('clear-editor', function(e) {
    e.preventDefault();
    clearEditor();
  });

  // Use this function to configure the ace editor instance
  $scope.aceLoaded = function (ed) {
    var editor = ed;

    $scope.editor = editor;

    $scope.editor.session.setMode('ace/mode/text');

    $scope.editor.setOption("spellcheck", true);

    // we want to always know what text the user currently has selected
    // TODO: change this to listen for a selection change
    editor.on('mouseup',
      function(e) {
        $timeout(function() {
          $log.log('MOUSE UP event');
          // this would only exist when the user has just selected something
          var currentSelection = getSelection();
          var text = editor.session.getTextRange(currentSelection);
          $log.log("currentSelection: " + currentSelection + ", text: " + text);
          // this function is on segmentAreaCtrl
          $scope.setTextSelection(text, currentSelection);
        }, 500);
      }
    );

    // working - select the current token based on the edit mode
    // the logic here is complex -- add unit tests
    editor.on('click', function(e) {
      var tokenAndRange = getCurrentTokenAndRange();
      var token = tokenAndRange.token;

      // make sure the user isn't trying to click into the same token to edit it
      if ($scope.lastToken !== token) {
        $scope.lastToken = token;

        // note - these properties are on the parent (segmentCtrl)
//        $scope.$apply(
//          function() {
//          }
//        );
            $scope.toggleToolbar(false);
            $scope.queryGlossary(token.value, 'deu', 'eng');
            $scope.glossary.glossaryQuery = token.value;
      }
    });

    // enable autocompletion, and set the autocompleters from the autocompleters service
    editor.setOptions({enableBasicAutocompletion: true});
// This creates a custom autocomplete function for Ace! - fuckin cool
//    langTools.addCompleter(glossaryCompleter);

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

      $log.log("Editor height: ");
      $log.log(newHeight);

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
      }

      $log.log('INPUT EVENT');
      $log.log('$scope.index: ' + $scope.index)
      $log.log(logAction);

      session.logAction(logAction)
      previousValue = newValue;
    }
  })
    editor.focus();

  };  // end AceLoaded


  // BEGIN - managing the active segment - TODO: move this to segmentAreaCtrl
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
      $scope.editor.focus();
      // smooth scrool
      var top = document.getElementById('segment-' + $scope.index).offsetTop;
      $("body").animate({scrollTop: top-300}, "slow");
    }
  });

  // end move to segment area ctrl

// TODO: maintain the current TM matches based on the selected token in the source side
  $scope.minPhraseLen = 15;
  var tmQueried = false;
  $scope.augmentTM = function(minPhraseLen) {
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
  };

  //
  $scope.onPaste = function(index, event) {
    $log.log('paste event');
    $log.log(event);
    // TODO send to our logger
  };

  $scope.onCopy = function(index, event) {
    $log.log('copy event');
    $log.log(event);
    // TODO send to our logger
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


}]);

