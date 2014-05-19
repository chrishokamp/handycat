angular.module('controllers', []);
//angular.module('editorComponentsApp.controllers', []);

angular.module('controllers')
.controller('StatsController', ['$scope', 'project', function($scope, project) {

  $scope.log = project.log;
  $scope.stats = project.stats;

}]);