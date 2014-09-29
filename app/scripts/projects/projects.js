angular.module('controllers')
.controller('ProjectCtrl', ['$scope', 'Projects', 'XliffParser', '$stateParams', '$state', '$log', function($scope, Projects, XliffParser, $stateParams, $state, $log) {

    // Chris: this is called when the project-list template is initialized
    $scope.find = function() {
      Projects.query(function(projects) {
        $log.log('PROJECTS');
        $log.log(projects);
        $scope.projects = projects;
      });
    };

    // Working - pass the project resource as the state change data
    $scope.findOne = function() {
      Projects.get({
        projectId: $stateParams.projectId
      }, function(project) {

        // $scope.projectResource now holds a reference to the $resource
        // the Document service will hold the XML content after the doc is parsed by xliffParser
        // WORKING - remove the Document service, put its functionality on the EditAreaCtrl
//        $scope.projectResource = project;
//        XliffParser.parseXML(project.content);

        // test transition to a state with data
//        $state.go('teststate', project);
      });
    };

    // Working - pass the project resource as the state change data
//    $scope.loadProject = function(projectId) {
//      Projects.get({
//        projectId: $stateParams.projectId
//      }, function(project) {

        // $scope.projectResource now holds a reference to the $resource
        // the Document service will hold the XML content after the doc is parsed by xliffParser
        // WORKING - remove the Document service, put its functionality on the EditAreaCtrl
//        $scope.projectResource = project;
//        XliffParser.parseXML(project.content);

        // test transition to a state with data
//        $log.log('Got project, loading...');
//        $log.log(project);
//        $state.go('teststate', project);
//      });
//    };

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

