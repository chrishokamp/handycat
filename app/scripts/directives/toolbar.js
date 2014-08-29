angular.module('directives').directive('toolbar', ['session', '$log', '$timeout', function(session, $log, $timeout) {
  return {
    restrict: 'E',
    scope: {
      visible: '='
    },
    templateUrl: 'scripts/directives/toolbar.html',
    link: function($scope, el, attrs){
      $log.log('ATTRS');
      $log.log(attrs);
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
    }
  }
}]);

