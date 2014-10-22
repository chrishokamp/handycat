// the segment area is the area of the UI representing a single translation unit
// this is a source + target pair
angular.module('controllers')
.controller('SegmentAreaCtrl', [
  '$rootScope', '$scope', 'Wikipedia', 'Glossary', '$log', 'ruleMap', 'copyPunctuation', 'editSession',
   'Logger', 'Projects', 'XliffParser',
  function($rootScope, $scope, Wikipedia, Glossary, $log, ruleMap, copyPunctuation, Session, Logger,
           Projects, XliffParser) {

  $scope.outputLog = function () {
    $log.log('SEGMENT AREA OUTPUT LOG');
    Logger.exportJSON();
  };

  // this gets reset in the template
  $scope.id = {};
  // default height for editor components
  $scope.height = {'editorHeight': 0};
  $scope.$watch(
    function() {
      return $scope.height.editorHeight;
    },
    function(val) {
      $scope.internalHeightStyle = {'height': val};
    }
  );


  // TODO: set this only when this is actually the active scope
  $scope.isActive = { active:true };

  // TODO: segment state should be directly linked to the XLIFF document
  // TODO: currently not implemented
  // working: only one field on this object (not currentState AND completed)
  // states: [ 'pending', 'editing', 'complete' ]
  $scope.segmentState = { currentState: 'untranslated', completed: false };

  // this is the interface to segment state -- always change via this interface
  $scope.changeSegmentState = function changeSegmentState (stateName) {
    $scope.segmentState = stateName;

  }

  $scope.$on('activate-segment', function(event, index) {
    if ($scope.index === index) {
      // tell the scope to create the editor element
      $scope.$broadcast('activate');
    }
  });

//  // for the concordancer - default to English
//  $scope.queryLang = 'en';
//
//// currently the model names on the child controllers are different
//  $scope.setSource = function(sourceSentence) {
//    $log.log("setSource");
//    $log.log("source is: " + sourceSentence);

//    $scope.segment.source = sourceSentence;
//  };
//  $scope.setTarget = function(targetSentence) {
//     $scope.segment.target = targetSentence;
//  };
//

//  // Text currently selected in the child editor
$scope.setTextSelection = function(text, range) {
  $scope.selectedToken = text;
  $scope.selectedRange = range;
  $log.log('setTextSelection fired, selectedToken: '+$scope.selectedToken+' selectedRange: ' + $scope.selectedRange);
};
$scope.clearSelection = function() {
  $scope.selectedToken = '';
  $scope.selectedRange = '';
};

//  $scope.copySourcePunctuation = function(segment) {
//    $log.log('copy source called from segment ' + segment);
//    var source = $scope.segment.source;
//    var target = $scope.segment.target;
//    $scope.segment.target = copyPunctuation.copySourcePunctuation(source, target);
//
//    Session.updateStat('copyPunctuation', $scope.$index);
//    // Only adds the action to the edit history if it actually did something.
//    if ($scope.segment.target !== target) {
//      $scope.editHistory.push(
//        ruleMap.newRule('copy-source-punctuation', '', '', 'Copy punctuation from source segment', segment));
//    }
//  };
//
//  $scope.findAndReplace = function(original, change, segment) {
//    var regexp = original;
//    console.log($scope.segment.target);
//    var newTarget = $scope.segment.target.replace(new RegExp(regexp), change);
//    console.log(newTarget);
//    if (newTarget !== $scope.segment.target) {
//      $scope.segment.target = newTarget;
//      var msg = 'Find and Replace: ' + original + " → " + change;
//      $scope.editHistory.push(
//        ruleMap.newRule('find-and-replace', original, change, msg, segment));
//      Session.updateStat('pearl-find-and-replace', $scope.$index, msg);
//    }
//  };
//
//  $scope.findAndReplaceTokens = function(original, change, segment) {
//    var regexp = '\\b' + original + '\\b';
//    console.log($scope.segment.target);
//    var newTarget = $scope.segment.target.replace(new RegExp(regexp), change);
//    console.log(newTarget);
//    if (newTarget !== $scope.segment.target) {
//      $scope.segment.target = newTarget;
//      var msg = 'Find and Replace tokens: ' + original + " → " + change;
//      $scope.editHistory.push(
//        ruleMap.newRule('find-and-replace-tokens', original, change, msg, segment));
//      Session.updateStat('pearl-find-and-replace-tokens', $scope.$index, msg);
//    }
//  };
//
//  // sets the current target token
//  $scope.setCurrentToken = function(token) {
//     $scope.currentToken = token;
//  };
//
//  // special chars toolbar showing
//  $scope.showSpecialChars = true;
//
//  // testing the special chars directive
    // TODO - let the user set this up
    // Let the user define the macros they want to use
//  $scope.germanChars = ['ä','ö','ü','Ä','Ö','Ü','ß'];
//  $scope.insertChar = function(char) {
//    $log.log("char to insert: " + char);
//    $scope.insertText(char);
//  };
//
//
//// TODO: collapse (remove from DOM) when this segment goes out of focus
//  $scope.isCollapsed = {collapsed: true, clicked: false};
//  $scope.toggleToolbar = function(bool) {
//    if (arguments.length > 0) {
//      $scope.isCollapsed = { collapsed: bool };
//// TODO: there is a broken corner-case here
//    } else {
//      $scope.isCollapsed = { collapsed: !$scope.isCollapsed.collapsed };
//    }
//    $log.log("isCollapsed: the value of isCollapsed is: " + $scope.isCollapsed.collapsed);
//  };

  $scope.clearEditor = function() {
   $log.log('clear editor fired on the segment control');
   $scope.$broadcast('clear-editor');
  };


  // Informs other segments that they should make a change.
  // The event argument is a unique object created by the ruleMap service.
  // The event will probably be received by the broadcaster as well so the action handlers
  // should check first if the edit should be applied or not.
  $scope.propagateEdit = function(index) {
    $rootScope.$broadcast('propagate-action', $scope.editHistory[index]);
    Session.updateStat('propagateAction', $scope.$index, $scope.editHistory[index].operation);
  };

  // Trigger propagated edits
//  $scope.$on('propagate-action', function(event, edit) {
//    if ($scope.segmentState.completed)
//      return; // do not modify completed segments
//
//    var from = edit.segment;
//
//    $log.log(edit);
//    if (edit.operation == 'copy-source-punctuation') {
//      $scope.copySourcePunctuation(from);
//    } else if (edit.operation == 'find-and-replace-tokens') {
//      $scope.findAndReplaceTokens(edit.original, edit.change, from);
//    } else if (edit.operation == 'find-and-replace') {
//      $scope.findAndReplace(edit.original, edit.change, from);
//    } else if (edit.operation == 'change-token-number') {
//      $scope.findAndReplaceTokens(edit.context, edit.change, from);
//    } else if (edit.operation == 'change-token-gender') {
//      $scope.findAndReplaceTokens(edit.context, edit.change, from);
//    } else if (edit.operation == 'change-token-case') {
//      $scope.findAndReplaceTokens(edit.context, edit.change, from);
//    }
//    // Add more action handlers here if needed.
//  });

//  $scope.addToEditHistory = function(edit) {
//    $scope.editHistory.push(edit);
//  };

  // List of edit actions performed on this segment
  $scope.editHistory = [];

  // TODO: project should listen for this event, we shouldn't have a separate function to update the project
  $scope.segmentFinished = function(segId) {
    $log.log("SEGMENT FINISHED - segId is: " + segId);
    $scope.segmentState.completed = true;
    $scope.isActive.active = false;

    Session.updateStat('segmentFinished', segId);

    // TODO: call a function on the document API - document API should all be in EditAreaCtrl
    // TODO: this is not the right interface -- completedSegments should not be stored outside of the XLIFF DOM
    // -- big question: should we maintain a javascript document model, or only use the XLIFF DOM
    $scope.document.completedSegments[segId] = true;

    // TODO: the rest of this function should be on the EditAreaCtrl
    // pass in the current segment as the argument -- let the segmentOrder service do the logic to determine what the next segment should be
    // - this line is CRITICAL - tells the UI to move to the next segment
    $log.log('$scope.index: ' + $scope.index);
    Session.focusNextSegment($scope.index);

    // Update the current segment in the XLIFF DOM
    // Note: the application critically relies on the targetDOM being a link into the DOM object of the XLIFF
    // Right now, we depend on $scope.segment.targetDOM.textContent and $scope.segment.target being manually synced
    $scope.segment.targetDOM.textContent = $scope.segment.target;
    $scope.document.revision++;

    // Update the project on the server
    $scope.projectResource.content = XliffParser.getDOMString($scope.document.DOM);
    $scope.projectResource.$update(function() {
      $log.log('Project updated');
    });

  };

  // Re-opens a finished segment. Undoes what segmentFinished() did
  // TODO: this should be handled within the element itself -- there should be a single interface to segmentState
  $scope.reopen = function(idx) {
    $scope.segmentState.completed = false;
    Session.setSegment(idx);
    $scope.isActive.active = true;
  };

  // when the changeSegment event fires, each AceCtrl scope responds
  // TODO: this event overlaps with change-segment-state
  // the change segment event is fired from changeSegment in the editSession service
  // TODO: move this code to EditAreaCtrl
  $scope.$on('changeSegment', function(e,data) {
    if (data.currentSegment === $scope.index) {
      // tell the staticTarget directive to create the editor element
      $scope.$broadcast('activate');
      // smooth scroll
      var top = document.getElementById('segment-' + $scope.index).offsetTop;
      // scroll and add space for the navbar
      var navBarHeight = 100;
      $("body").animate({scrollTop: top - navBarHeight}, "slow");
    }
  });

}]);
