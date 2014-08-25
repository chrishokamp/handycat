angular.module('controllers')
.controller('ProjectCtrl', ['$scope', 'Projects', 'XliffParser', '$stateParams', '$log', function($scope, Projects, XliffParser, $stateParams, $log) {

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

        // $scope.projectResource now holds a reference to the $resource
        // the Document service will hold the XML content after the doc is parsed by xliffParser
        $scope.projectResource = project;
        XliffParser.parseXML(project.content);
      });
    };

}]);

