'use strict';

define(['controllers/controllers'], function(controllers) {

  controllers.controller('AceCtrl', ['$scope', 'Document', function($scope, Document) {

    $scope.fullDoc = Document;

    $scope.setText = function(text) {
      var editor = $scope.editor;
      if (editor) {
       editor.setValue(text);
      }
    };

    $scope.setModel = function(index) {
      var segName = seg + index;
      $scope.segName = $scope.segments[index];
      return segName;
    }

    $scope.getSelection = function() {
      var editor = $scope.editor;
      if (editor) {
        // TEST: log the text
        console.log($scope.editor.session.getTextRange(editor.getSelectionRange()));

        //get selection range
        var r = editor.getSelectionRange();
        // Now add some markup to this text
        //add marker
        var session = editor.session;
        r.start = session.doc.createAnchor(r.start);
        r.end = session.doc.createAnchor(r.end);
        //r.id = session.addMarker(r, "ace_step", "text")

        // the last element tells us whether to put the marker in front of the text or behind it
        // true = in front, false = behind
        // there are two marker layers
        r.id = session.addMarker(r, "was-selected", "text", false);

        // TODO: what does addDynamicMarker do?
        //r.id = session.addDynamicMarker(r, "was-selected", "text", false);

        // TODO: move this UI-logic into a dynamically-creatable directive
        // Another option is adding the directive into the Ace marker creation template
        $('.was-selected').css('background-color', 'yellow');
        $('.was-selected').addClass('selectedByJquery');

        $('.was-selected').draggable({
          revert: function(droppable) {
            if (!droppable) {
              d("reverting to orginal position");
              return true;
            } else {
              return false;
            }
          },
          start: function(ev, ui) {
            var $elem = $(ev.target);
            d("you started dragging a draggable");
            // TODO: disable any droppables attached to this element when the whole element is being dragged
            var $gaps = $elem.children('.ui-droppable');
            $gaps.droppable('option', 'disabled', true);

            var $token = $(ev.target);

            // TODO: tests only!
            //$token.addClass('in-drag');
            $token.addClass('i-was-dragged');
            //$token.removeClass('i-was-dragged');
          },
          stop: function(ev, ui) {
            var $elem = $(ev.target);
            var $gaps = $elem.children('.ui-droppable');
            $gaps.droppable('option', 'disabled', false);

            var $token = $(ev.target);
            //$token.removeClass('in-drag');

          }
        });
        // TODO: add logic to handle splitting the marker when user types <space>
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

    // Use this function to configure the ace editor instance
    $scope.aceLoaded = function (_editor) {

      var editor = _editor;
      $scope.editor = editor;
      var session = editor.getSession();

      // TODO: move styling to the view
      // hide the print margin
      editor.setShowPrintMargin(false);
      // wrap words
      session.setUseWrapMode(true);

      // TODO: how to limit the Ace editor to a certain number of lines?
      //editor.setOption("maxLines", 1);
      //editor.setOptions({
      //  maxLines: 1
      //});

      $scope.startText = "gloss over source to see the target phrase alignment";
// TODO: see moses - how to get translation alignment?
      editor.setFontSize(20);
      editor.setValue($scope.startText);
      //editor.setTheme("ace/theme/twilight");  // Note: the editor themes are called by their string names (these are not paths)
      //console.log("here's the _renderer theme:")
      //console.log(_renderer.getTheme());
      // interact with the ace session using editor, session, etc...

      var renderer = editor.renderer;
      session.on("change", function(){
      console.log(editor.getValue());
      console.log("the ace session change event fired") });
    }

  }]);
});

