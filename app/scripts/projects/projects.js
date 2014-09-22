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
        // WORKING - remove the Document service, put its functionality on the EditAreaCtrl
        $scope.projectResource = project;
        XliffParser.parseXML(project.content);
      });
    };

    // TODO: the XLIFF data should be stored on the $scope of the ProjectCtrl
    // TODO: there should be one ProjectCtrl for each project, and a separate ProjectListCtrl to handle the list of projects

    // TODO: show confirmation modal
    $scope.remove = function(project) {
      $log.log('Remove project');
      project.$remove();

      for (var i in $scope.projects) {

        if ($scope.projects[i] == project) {
          $scope.projects.splice(i, 1);
        }
      }
    };

    // TODO: this function should be accessible from project.create
//    $scope.update = function() {
//      //
//      var project = $scope.project;
//      project.$update(function() {
//        $location.path('projects/' + project._id);
//      });
//    };

}]);

