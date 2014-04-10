// the segment area is the area of the UI representing a single translation unit
// this is a source + target pair
angular.module('controllers')
.controller('SegmentAreaCtrl', [
  '$rootScope', '$scope', 'Wikipedia', 'Glossary', 'GermanStemmer', '$sce', '$log', 'ruleMap', 'copyPunctuation',
  'Document',
  function($rootScope, $scope, Wikipedia, Glossary, GermanStemmer, $sce, $log, ruleMap, copyPunctuation, Document) {

  // Note: don't do $scope.$watches, because we reuse this controller many times!
  // TODO: set this only when this is the active scope
  $scope.active = true;

  $scope.language = Document.targetLang;

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
    $log.log('change token number');
    $scope.$broadcast('change-token-number');
  };

  $scope.queryConcordancer = function(query) {
    $log.log('query is: ' + query);
    $scope.concordancerError = false;
    Wikipedia.getConcordances(query);
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

// TODO: testing
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

}]);

