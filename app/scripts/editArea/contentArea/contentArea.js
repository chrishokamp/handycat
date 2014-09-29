// Holds all of the translation pairs and handles the interface with the document API
// Content area is the place for global control of the /edit view
angular.module('controllers').controller('ContentAreaCtrl',
    ['$scope', 'editSession', '$location', '$state', '$stateParams', '$modal', '$rootScope', '$log', '$timeout',
    function($scope, editSession, $location, $state, $stateParams, $modal, $rootScope, $log, $timeout) {

      // TODO: remove the manual timeout -- wait for promise to resolve
      $timeout(function() {
        $scope.language = $scope.document.targetLang;
        $scope.numSegments = $scope.document.segments.length;
        // each segment is a reference to the segment in the Document service
        $scope.segments = $scope.document.segments;
        $log.log('SEGMENTS');
        $log.log($scope.segments);
        // watch the flag on the Documents service
        $scope.$watch(function() {

            return $scope.document.revision;
          },
          function() {
            $log.log("ContentAreaCtrl: Number of segments in document: " + $scope.document.segments.length);

            // segments is a list of [source, target] pairs
            $scope.segments = $scope.document.segments;

          }
        );
      },500);

  // this fires once the view content has completely loaded
  $rootScope.$on('repeat-finished', function (event) {
    // quick hack -- just activate segment 0
    editSession.setSegment(0);

    var segmentId = $stateParams.segmentId;
    if (segmentId) {
      var anchorElem = document.getElementById('segment-' + segmentId);
      if (anchorElem) {
        var top = anchorElem.offsetTop;
        $("body").animate({scrollTop: top-60}, "slow");
      }
    }
  });

  // if the state changes during the session without a reload
  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      var segmentId = toParams.segmentId;
      if (toState.name.match(/edit\.segment/) && segmentId) {
        var anchorElem = document.getElementById('segment-' + segmentId);
        if (anchorElem) {
          var top = anchorElem.offsetTop;
          $("body").animate({scrollTop: top-60}, "slow");
        }
      }
  });

  editSession.updateStat('pearl-document-loaded', -1, '');

  // DEV UTILS
  $scope.showXLIFF = editSession.debugXLIFF;
  // END DEV UTILS





}]);
