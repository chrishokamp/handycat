angular.module('directives').directive('toolbar', ['$log', function($log) {
  return {
    restrict: 'E',
    templateUrl: 'scripts/directives/toolbar.html',
    link: function($scope,el){
      $log.log('TOOLBAR');
      $scope.visible = false;
      $scope.$on('show-toolbar', function(e, data) {
        if ($scope.visible) {
          $log.log('TOOLBAR IS ALREADY SHOWING');
        } else {
          // TODO: get the element to insert after from the data parameter
          // This method lets us keep the toolbar component modular
          var top = $('#segment-' + 2);
          $(top).after(el);
          $scope.visible = true;
        }
      })

    }
  }
}]);

