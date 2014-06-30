// Holds all of the translation pairs and handles the interface with the Document service
// Content area is the place for global control of the /edit view
angular.module('controllers').controller('ContentAreaCtrl',
    ['$scope', 'Document', 'project', '$location', '$anchorScroll', '$state', '$modal', '$log',
    function($scope, Document, project, $location, $anchorScroll, $state, $modal, $log) {
  if (Document.segments.length === 0) {
    $state.go('project');
  }

  project.updateStat('pearl-document-loaded', -1, '');

  // DEV UTILS
  $scope.showXLIFF = project.debugXLIFF;
  // END DEV UTILS

  $scope.language = Document.targetLang;
  $scope.numSegments = Document.segments.length;
  // each segment is a reference to the segment in the Document service
  $scope.segments = Document.segments;

  // watch the flag on the Documents service
  $scope.$watch(function() {
      return Document.revision;
    },
    function() {
      $log.log("ContentAreaCtrl: Number of segments in document: " + Document.segments.length);

      // segments is a list of [source, target] pairs
      $scope.segments = Document.segments;

      // dev mode only
      if (Document.loaded) {
        $scope.xliff_content = new XMLSerializer().serializeToString( Document.DOM );
      }
    }
  );


  // TODO: focus the edit area -- edit areas call the translation memory onFocus
  // start by focusing project.currentSegment

}]);
