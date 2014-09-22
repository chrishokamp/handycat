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

    // TODO: the XLIFF data should be stored on the $scope of the ProjectCtrl
    // TODO: there should be one ProjectCtrl for each project, and a separate ProjectListCtrl to handle the list of projects

    // TODO: implement project.delete and project.update
//    $scope.remove = function(blog) {
//      blog.$remove();
//
//      for (var i in $scope.blogs) {

//        if ($scope.blogs[i] == blog) {
//          $scope.blogs.splice(i, 1);
//        }
//      }
//    };
//
//    $scope.update = function() {
//      //
//      var blog = $scope.blog;
//      blog.$update(function() {
//        $location.path('blogs/' + blog._id);
//      });
//    };
//
}]);

