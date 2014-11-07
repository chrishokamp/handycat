angular.module('directives')
  .directive('menuItem', ['$log', function($log) {
  return {
    scope: {
      projectName: '=',
      projectCreated: '=',
      projectState: '=',
      projectCreator: '=',
      projectId: '='
    },
    link: function($scope, el, attrs) {
      if (typeof($scope.projectCreated) === 'string') {
        $scope.projectCreated = new Date($scope.projectCreated);
        $log.log('Project created date: ');
        $log.log($scope.projectCreated);
      }
    },
    templateUrl: 'views/partials/projects/menu-item.html'
  }
}]);

