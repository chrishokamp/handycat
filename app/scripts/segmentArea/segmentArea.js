// the segment area is the area of the UI representing a single translation unit
// this is a source + target pair
angular.module('controllers')
.controller('SegmentAreaCtrl', ['$scope', 'Wikipedia', '$sce', '$log', function($scope, Wikipedia, $sce, $log) {
// TODO: display the results of the concordancer here, not from the AceCtrl

  // Note: don't do $scope.$watches, because we reuse this controller many times!

  // TODO: set this only when this is the active scope
  $scope.active = true;

  // Toolbar open
  $scope.toolbarOpen = false;
  $scope.queryConcordancer = function(query) {
    $log.log('query is: ' + query);
    Wikipedia.getConcordances(query);
  };
  $scope.$on('concordancer-updated', function(e) {
// does $scope.$apply happen automagically? - answer: no, so we have to listen for the event
    $scope.concordanceMatches = Wikipedia.currentQuery;
  })

  // convert a snippet to trusted html
  $scope.getSnippet = function(concordanceMatch) {
    return $sce.trustAsHtml(concordanceMatch.snippet);
  }

}]);

