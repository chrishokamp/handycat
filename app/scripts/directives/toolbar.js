angular.module('directives').directive('toolbar', ['$log', function($log) {
  return {
    restrict: 'E',
    templateUrl: 'scripts/directives/toolbar.html',
    link: function($scope,el){
      $log.log('TOOLBAR');

    }
  }
}]);

