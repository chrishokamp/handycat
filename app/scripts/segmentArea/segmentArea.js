// the segment area is the area of the UI representing a single translation unit
// this is a source + target pair
angular.module('controllers')
.controller('SegmentAreaCtrl', ['$scope', 'Wikipedia', 'Glossary', 'GermanStemmer', '$sce', '$log', function($scope, Wikipedia, Glossary, GermanStemmer, $sce, $log) {
// TODO: display the results of the concordancer here, not from the AceCtrl

  // Note: don't do $scope.$watches, because we reuse this controller many times!
  // TODO: set this only when this is the active scope
  $scope.active = true;

  $scope.setTarget = function(targetSentence) {
     $scope.target = targetSentence;
  };

  $scope.setSource = function(sourceSentence) {
     $scope.source = sourceSentence;
  };

  $scope.copySourcePunctuation = function() {
     $log.log('copy source called');
     if ($scope.source && $scope.target) {
        // TODO: Create server for this feature
        $scope.target += '.';
        $scope.$broadcast('target-updated');
        $log.log('target updated');
     }
  };

  $scope.setCurrentToken = function(token) {
     $scope.currentToken = token;
  };

  $scope.changeTokenNumber = function() {
    $log.log('change token number');
    $scope.$broadcast('change-token-number');
    
  }

  $scope.queryConcordancer = function(query) {
    $log.log('query is: ' + query);
    Wikipedia.getConcordances(query);
  };
  $scope.$on('concordancer-updated', function(e) {
// does $scope.$apply happen automagically? - answer: no, so we have to listen for the event
    $scope.concordanceMatches = Wikipedia.currentQuery;
  })

  // special chars toolbar showing
  $scope.showSpecialChars = true;

  // testing the special chars directive
  $scope.germanChars = ['ä','ö','ü','Ä','Ö','Ü','ß'];
  $scope.insertChar = function(char) {
    $log.log("char to insert: " + char);
    $scope.insertText(char);
  }


  // convert a snippet to trusted html - TODO: this isn't reusable becuase we send back x.snippet
  $scope.getSnippet = function(concordanceMatch) {
    return $sce.trustAsHtml(concordanceMatch.snippet);
  }

  // used as a callback for the glossary
  var updateGlossaryArea = function(glossaryMatches) {
    $log.log('Inside callback, the glossary matches: ')
    $log.log(glossaryMatches);
    $scope.glossaryMatches = glossaryMatches.map(function(item) {
      return item.text;
    });
  }

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
  }

  $scope.clearEditor = function() {
   $log.log('clear editor fired on the segment control');
   $scope.$broadcast('clear-editor');
  }

  $scope.getOtherWordForms = function(stemmedToken) {
    $log.log('other word forms called with: ' + stemmedToken);
    $scope.otherWordForms = GermanStemmer.getOtherForms(stemmedToken);
  };

// TODO: use a promise
  $scope.queryGlossary = function(query) {
    Glossary.getMatches(query, updateGlossaryArea);

  }

}]);

