angular.module('directives')
  .directive('menuItem', ['$log', function($log) {
  return {
    scope: {
      projectName: '=',
      projectSourceLang: '=',
      projectTargetLang: '=',
      projectCreated: '=',
      projectState: '=',
      projectCreator: '=',
      projectId: '='
    },
    link: function($scope, el, attrs) {
      if (typeof($scope.projectCreated) === 'string') {
        $scope.projectCreated = new Date($scope.projectCreated);
      }
    },
    templateUrl: 'scripts/projects/menu-item.html'
  }
}]);


