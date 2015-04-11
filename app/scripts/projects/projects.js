// TODO: there should be one ProjectCtrl for each project, and a separate ProjectListCtrl to handle the list of projects
// TODO: right now the ProjectCtrl handles both 'Projects' and 'Project'
angular.module('controllers')
.controller('ProjectCtrl', ['$scope', 'Projects', 'XliffParser', '$stateParams',
    function($scope, Projects, XliffParser, $stateParams) {

    // Chris: this is called when the project-list template is initialized
    $scope.find = function() {
      Projects.query(function(projects) {
        $scope.projects = projects;
      });
    };

    $scope.findOne = function() {
      Projects.get({
        projectId: $stateParams.projectId
      }, function(project) {

      });
    };

    // TODO: show confirmation modal
    $scope.remove = function(project) {
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

