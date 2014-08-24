angular.module('controllers')
.controller('ProjectCtrl', ['$scope', 'Projects', '$log', function($scope, Projects, $log) {
    $scope.projects = [
      { "name": "test-project1"},
      { "name": "test-project2"},
      { "name": "test-project3"},
    ];

         // Chris: this is called when the project-list template is initialized
    $scope.find = function() {
      Projects.query(function(projects) {
        $log.log('PROJECTS');
        $log.log(projects);
        $scope.projects = projects;
      });
    };
}]);

