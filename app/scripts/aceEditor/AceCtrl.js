'use strict';

define(['controllers/controllers'], function(controllers) {

  controllers.controller('AceCtrl', ['$scope', 'Document', 'TranslationMemory', '$log', function($scope, Document, TranslationMemory, $log) {

    $scope.fullDoc = Document;

    $scope.setModel = function(index) {
      var segName = seg + index;
      $scope.segName = $scope.segments[index];
      return segName;
    }

    var populateTM = function(tmMatches) {
      // list of objects like this:
//      quality: 100
//      rank: 100
//      source: "apple"
//      target: "Apfel"

      _.each(tmMatches, function(matchObj, i){
        $log.log("TM match: " + i + " -- " + matchObj.target)
      });
    }

    // TODO: this only works when the editor's aceLoaded event has fired
    $scope.setText = function(text) {
      var editor = $scope.editor;
      if (editor) {
        editor.setValue(text);
      }
    };

    // TODO: WORKING - slider to control TM precision



    // TM testing section
    $scope.testQuery = 'document';
    $scope.testQuery = 'computer';
    //$scope.testQuery = 'apple';
    $scope.queryTM = function(query) {
      // pass in the query and the callback
      TranslationMemory.getMatches(query, populateTM);
    }
    // End TM testing section
    $scope.testQuery = 'document';

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

    // Use this function to configure the ace editor instance
    $scope.aceLoaded = function (_editor) {
      d("inside ace loaded");

      var editor = _editor;
      $scope.editor = editor;
      var session = editor.getSession();

      // TESTING TO FIND HOW ACE USES ITS CONTAINER ELEMENT
      d("Logging the renderer");
      var renderer = editor.renderer;
      var container = renderer.getContainerElement();
      d(container);
      // END TESTING

      // TODO: move styling to the view
      // hide the print margin
      editor.setShowPrintMargin(false);
      // wrap words
      session.setUseWrapMode(true);

      // TESTING: dynamically set the mode - TODO: this works
      // TODO:
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

