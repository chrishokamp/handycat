angular.module('directives').directive('toolbar', ['editSession', '$log', '$timeout', '$interval', function(editSession, $log, $timeout, $interval) {
  // this directive shares scope with the current active segment area
  // the toolbar communicates with the segment area to perform queries and populate new data
  return {
    restrict: 'E',
    templateUrl: 'scripts/directives/toolbar.html',
    link: function($scope, el, attrs){
     $timeout(function(){
      $scope.$watch(
        function () {
          return $scope.activeSegment;
        },
        function(index) {
          // TODO: reinitialize the toolbar fields when the active segment changes
          $log.log('toolbar: ACTIVE SEGMENT CHANGED');
          $log.log(index);
          var above = $('#segment-' + index);
          $(above).after(el);
        }
      )},0);

      // testing
      $timeout(
        function() {
          $log.log('current $scope')
          $log.log($scope);
        }, 3000
      )

      // Events for interacting with the toolbar
      $scope.$on('update-glossary-area', function(evt, data) {
        $log.log('toolbar: update-glossary-area');
        $log.log(data);

        $scope.glossaryMatches = data.map(function(item) {
          return item.text;
        });
      })

      $scope.$on('update-tm-area', function(evt, data) {
        $log.log('toolbar: update-tm-area');
        $log.log(data);

        // TODO: datastructure for TM matches -- isomorphic to TBX specification
//        $scope.tmMatches = data.map(function(item) {
//          return item.text;
//        });
        $scope.tmMatches = data
      })
    }
  }
}]);

