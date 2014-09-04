angular.module('directives').directive('toolbar', ['editSession', '$log', function(session, $log) {
  return {
    restrict: 'E',
    templateUrl: 'scripts/directives/toolbar.html',
    link: function($scope, el, attrs){
      $scope.$watch(
        function () {
          return session.activeSegment;
        },
        function(index) {
          $log.log('ACTIVE SEGMENT CHANGED');
          $log.log(index);
          // TODO: get the element to insert after from the data parameter
          // This method lets us keep the toolbar component modular
          var above = $('#segment-' + index);
          $log.log('');
//            $(document).remove
          $(above).after(el);
        }
      );

      // when the directive gets initialized
      var index = session.activeSegment;
      var above = $('#segment-' + index);
      $(above).after(el);
    }
  }
}]);

