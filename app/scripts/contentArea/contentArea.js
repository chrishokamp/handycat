// Holds all of the translation pairs and handles the interface with the Document service
angular.module('controllers').controller('ContentAreaCtrl',
    ['$scope', 'Document', 'project', '$location', '$anchorScroll', '$state', '$log',
    function($scope, Document, project, $location, $anchorScroll, $state, $log) {
  if (Document.segments.length === 0) {
    $state.go('project');
  }
  $scope.numSegments = Document.segments.length;
  // each segment is a reference to the segment in the Document service
  $scope.segments = Document.segments;

  // watch the flag on the Documents service
  $scope.$watch(function() {
      if (!Document.loaded)
        return false;
      else
        return Document.revision;
    },
    function() {
      $log.log("ContentAreaCtrl: Number of segments in document: " + Document.segments.length);

      // segments is a list of [source, target] pairs
      //$scope.segments = Document.segments;
      $scope.segments = Document.segments;

      $scope.xliff_content = new XMLSerializer().serializeToString( Document.DOM );
    }
  );

  // focus the edit area -- edit areas call the translation memory onFocus
  // start by focusing project.currentSegment

}]);
