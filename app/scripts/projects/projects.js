angular.module('controllers')
.controller('ProjectCtrl', ['$scope', 'Projects', 'XliffParser', '$stateParams', '$log', function($scope, Projects, XliffParser, $stateParams, $log) {
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

    $scope.findOne = function() {
      Projects.get({
        projectId: $stateParams.projectId
      }, function(project) {
        $log.log('PROJECT RETRIEVED');
        $scope.project = project;
        XliffParser.parseXML(project.content);
      });
    };

}]);

