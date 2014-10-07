angular.module('directives').directive('hudToolbar', ['$log',
  function($log) {
    return {
      restrict: 'E',
      replace: 'true',
      templateUrl: 'scripts/editArea/toolbar/hud-toolbar.html',
      link: function($scope,el){
        // TODO: switch to toggle on-off
        $scope.toggleToolbar = function () {
          $log.log('TOGGLE TOOLBAR');
          $rootScope.$broadcast('show-toolbar');
        }
      }
    }
  }]);
