angular.module('directives').directive('toolbar', ['editSession', '$log', '$timeout', function(session, $log, $timeout) {
  // this directive shares scope with the current active segment area
  // the toolbar communicates with the segment area to perform queries and populate new data
  return {
    restrict: 'E',
    templateUrl: 'scripts/directives/toolbar.html',
    link: function($scope, el, attrs){
     $timeout(function(){
      $scope.$watch(
        function () {
          return session.activeSegment;
        },
        function(index) {
          $log.log('ACTIVE SEGMENT CHANGED');
          $log.log(index);
          var above = $('#segment-' + index);
          $(above).after(el);
        }
      )},0);

      // when the directive gets initialized
      var index = session.activeSegment;
      var above = $('#segment-' + index);
      $(above).after(el);

      $scope.$on('update-glossary-area', function(evt, data) {
        $log.log('toolbar heard update-glossary-area');
        $log.log(data);

        $scope.glossaryMatches = data.map(function(item) {
          return item.text;
        });
      })

    }
  }
}]);

