angular.module('directives').directive('toolbar', ['$log', '$timeout', function($log, $timeout) {
  return {
    restrict: 'E',
    scope: {
      visible: '='
    },
    templateUrl: 'scripts/directives/toolbar.html',
    link: function($scope, el, attrs){
      $log.log('ATTRS');
      $log.log(attrs);
//      $scope.visible = selected;
//      $scope.visible = true;
//      $timeout(
//        function() {
//          $scope.$watch(
//            function () {
//              return selected.toolbar;
//            },
//            function(value) {
//              $log.log('VALUE');
//              $log.log(value);
//          if ($scope.visible) {
//            $log.log('TOOLBAR IS ALREADY SHOWING');
//          } else {
//            // TODO: get the element to insert after from the data parameter
//            // This method lets us keep the toolbar component modular
//            var top = $('#segment-' + 2);
//            $(top).after(el);
//            $scope.visible = true;
//          }
//            })
//        },0
//      )
    }
  }
}]);

