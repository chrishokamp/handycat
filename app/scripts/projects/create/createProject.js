angular.module('controllers')
.controller('CreateProjectCtrl', ['$timeout', '$scope', '$rootScope', function($timeout, $scope, $rootScope) {
    // To let close the Single Event modal
    $scope.close = function() {
      $scope.$close(true);
//      $modalInstance.dismiss('cancel');
//      $modalInstance.dismiss();
//      $modalInstance.close();
    };

    $scope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
      console.log('logging to:');
      console.log(to.name);
      if (to.name !== 'projects.create') {
        // Note: this requires the custom ui-bootstrap version (0.12.0)
        // only $dismiss works currently, not $close
        $scope.$dismiss();
      }
    });

}]);

