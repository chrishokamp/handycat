// the segment area is the area of the UI representing a single translation unit
// this is a source + target pair
angular.module('controllers')
.controller('SegmentAreaCtrl', [
  '$rootScope', '$scope', 'Wikipedia', 'Glossary', 'GermanStemmer', '$sce', '$log', 'ruleMap', 'copyPunctuation',
  'Morphology', 'Document', 'project',
  function($rootScope, $scope, Wikipedia, Glossary, GermanStemmer, $sce, $log, ruleMap, copyPunctuation, Morphology,
           Document, Project) {

  // Note: don't do $scope.$watches, because we reuse this controller many times!
  // TODO: set this only when this is the active scope
  $scope.isActive = { active:true };

  /*
  $scope.activate = function(index) {
  $log.log("Index: " + $scope.index);
    $rootScope.$broadcast('activate-segment', index);
  };

  $scope.$on('activate-segment', function(event, index) {
      $log.log("Index: " + $scope.index + " " + "index: " + index);
    $scope.isActive.active = $scope.index == index;
  });*/

  $scope.language = Document.targetLang;

  // for the concordancer - default to English
  $scope.queryLang = 'en';

// TODO - Working - make sure that the child controllers all share the state for source/target
// currently the model names on the child controllers are different
  $scope.setSource = function(sourceSentence) {
     $scope.segment.source = sourceSentence;
  };
  $scope.setTarget = function(targetSentence) {
     $scope.segment.target = targetSentence;
  };

  // Text currently selected in the child editor
  $scope.setTextSelection = function(text, range) {
    $scope.selectedToken = text;
    $scope.selectedRange = range;
  };

  $scope.copySourcePunctuation = function() {
    $log.log('copy source called');
    var source = $scope.segment.source;
    var target = $scope.segment.target;
    $scope.segment.target = copyPunctuation.copySourcePunctuation(source, target);

    // Only adds the action to the edit history if it actually did something.
    if ($scope.segment.target !== target) {
      $scope.editHistory.push(
        ruleMap.newRule('copy-source-punctuation', '', '', 'Copy punctuation from source segment'));
    }
  };

  $scope.setCurrentToken = function(token) {
     $scope.currentToken = token;
  };

  $scope.changeTokenNumber = function() {
    // toggle the working state of the button
    $scope.changeNumberWorking = true;

    // the current selection is a range object from the Ace Editor
    if ($scope.selectedToken && $scope.selectedRange) {
      $log.log('change token number');
      var phrase = $scope.selectedToken;
      $log.log('the phrase to change is: ' + phrase);

      var res = Morphology.changeNumber(phrase, 'de');
      res.then(
        function(result) {
          $log.log('the result from the morphology server: ');
          $log.log(result);

          // this function is on the AceCtrl
          $scope.insertText(result.data['converted_phrase']);
          $scope.changeNumberWorking = false;
        },
        function(err) {
          $log.log('changeNumber failed');
          $scope.changeNumberWorking = false;
        }
      );
    }
  };
  $scope.changeTokenGender = function() {
    // toggle the working state of the button
    $scope.changeGenderWorking = true;

    // the current selection is a range object from the Ace Editor
    if ($scope.selectedToken && $scope.selectedRange) {
      $log.log('change token gender');
      var phrase = $scope.selectedToken;
      $log.log('the phrase to change is: ' + phrase);

      var res = Morphology.changeGender(phrase, 'de');
      res.then(
        function(result) {
          $log.log('the result from the morphology server: ');
          $log.log(result);

          // this function is on the AceCtrl
          $scope.insertText(result.data['converted_phrase']);
          $scope.changeGenderWorking = false;
        },
        function(err) {
          $log.log('changeGender failed');
          $scope.changeGenderWorking = false;
        }
      );
    }
  };
  $scope.changeTokenCase = function() {
    // toggle the working state of the button
    $scope.changeCaseWorking = true;

    // the current selection is a range object from the Ace Editor
    if ($scope.selectedToken && $scope.selectedRange) {
      $log.log('change token case');
      var phrase = $scope.selectedToken;
      $log.log('the phrase to change is: ' + phrase);

      var res = Morphology.changeCase(phrase, 'de');
      res.then(
        function(result) {
          $log.log('the result from the morphology server: ');
          $log.log(result);

          // this function is on the AceCtrl
          $scope.insertText(result.data['converted_phrase']);
          $scope.changeCaseWorking = false;
        },
        function(err) {
          $log.log('changeCase failed: ' + err);
          $scope.changeCaseWorking = false;
        }
      );
    }
  };

  $scope.queryConcordancer = function(query, lang) {
    $log.log('query is: ' + query + ', lang is: ' + lang);
    $scope.concordancerError = false;
    Wikipedia.getConcordances(query, lang);
  };

  $scope.$on('concordancer-updated', function() {
// does $scope.$apply happen automagically? - answer: no, so we have to listen for the event
    $scope.concordanceMatches = Wikipedia.currentQuery;
  });

  $scope.$on('concordancer-error', function() {
    $scope.concordancerError = true;
  });

  // special chars toolbar showing
  $scope.showSpecialChars = true;

  // testing the special chars directive
  $scope.germanChars = ['ä','ö','ü','Ä','Ö','Ü','ß'];
  $scope.insertChar = function(char) {
    $log.log("char to insert: " + char);
    $scope.insertText(char);
  };

  // convert a snippet to trusted html - TODO: this isn't reusable becuase we send back x.snippet
  $scope.getSnippet = function(concordanceMatch) {
    return $sce.trustAsHtml(concordanceMatch.snippet);
  };

  // used as a callback for the glossary
  var updateGlossaryArea = function(glossaryMatches) {
    $log.log('Inside callback, the glossary matches: ');
    $log.log(glossaryMatches);
    if (glossaryMatches)
      $scope.glossaryMatches = glossaryMatches.map(function(item) {
        return item.text;
      });
  };

// TODO: collapse (remove from DOM) when this segment goes out of focus
  $scope.isCollapsed = {collapsed: true};
  $scope.toggleToolbar = function(bool) {
    if (arguments.length > 0) {
      $scope.isCollapsed = { collapsed: bool };
// TODO: there is a broken corner-case here
    } else {
      $scope.isCollapsed = { collapsed: !$scope.isCollapsed.collapsed };
    }
    $log.log("isCollapsed: the value of isCollapsed is: " + $scope.isCollapsed.collapsed);
  };

  $scope.clearEditor = function() {
   $log.log('clear editor fired on the segment control');
   $scope.$broadcast('clear-editor');
  };

  $scope.getOtherWordForms = function(stemmedToken) {
    $log.log('other word forms called with: ' + stemmedToken);
    $scope.otherWordForms = GermanStemmer.getOtherForms(stemmedToken);
  };

// TODO: use a promise
  // prep the model
  var glossary = {};
  glossary.glossaryQuery = undefined;
  $scope.glossary = glossary;
  $scope.queryGlossary = function(query) {
    Glossary.getMatches(query, updateGlossaryArea);
  };

  // Informs other segments that they should make a change.
  // The event argument is a unique object created by the ruleMap service.
  // The event will probably be received by the broadcaster as well so the action handlers
  // should check first if the edit should be applied or not.
  $scope.propagateEdit = function(index) {
      $rootScope.$broadcast('propagate-action', $scope.editHistory[index]);
  };

  // Trigger propagated edits
  $scope.$on('propagate-action', function(event, edit) {
    $log.log(edit);
    if (edit.operation == 'copy-source-punctuation') {
      $scope.copySourcePunctuation();
    }
    // Add more action handlers here if needed.
  });

  $scope.addToEditHistory = function(edit) {
    $scope.editHistory.push(edit);
  };

  // List of edit actions performed on this segment
  $scope.editHistory = [];

  $scope.segmentFinished = function(segId) {
    $log.log("segId is: " + segId);
    Document.completedSegments[segId] = true;
    Project.setActiveSegment(segId);
    Project.focusNextSegment();

    // Update the current segment
    $scope.segment.targetDOM.textContent = $scope.segment.target;
    Document.revision++;
  };

}]);

