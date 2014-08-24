angular.module('controllers')
.controller('CreateProjectCtrl', ['Document', 'Projects', '$log', '$scope', '$rootScope', function(Document, Projects, $log, $scope, $rootScope) {
    // To let close the Single Event modal
    $scope.close = function() {
      $scope.$close(true);
    };

    $scope.validXLIFF = false;
    $scope.documentLoading = false;

    // create the project, and drop to edit mode for that project
      // the project data should already be on the scope
      // is the XLIFF already parsed? - there should be a validation check to make sure this is a valid XLIFF

      // this is the current parsing flow
      // autoload a file
//      XliffParser.loadLocalFile(fileUrl);

      // go to the edit state
//      $scope.$on('document-loaded', function(e) {
//        $state.go('edit.segment', { segmentId: 0 });
//      });
      // create the project on the server

    // when a file is added, do the parsing immediately
    // call XliffParser, wait for the document loaded event, then flip the validXLIFF flag on the $scope
    function parse() {
      // TODO: send a promise back from the xliffParser
      $scope.documentLoading = true;
      $scope.$on('document-loaded', function() {
        $scope.validXLIFF = true;
        $scope.documentLoading = false;
      })
    }

    // make sure the modal closes if we change states
    $scope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
      console.log('logging to:');
      console.log(to.name);
      if (to.name !== 'projects.create') {
        // Note: this requires the custom ui-bootstrap version (0.12.0)
        // only $dismiss works currently, not $close
        $scope.$dismiss();
      }
    });

    $scope.create = function() {
      var project = new Projects({
        title: $scope.title,
        content: Document.getDOMString()
      });
      project.$save(function(response) {
        //Chris: where does the router send this?
//        $location.path("projects/" + response._id);
        $log.log('PROJECT SAVED');
      });

      $scope.title = "";
    };

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
//    // Chris: this is called when the blog <section> is initialized
//    $scope.find = function() {
//      Blogs.query(function(blogs) {
//        $scope.blogs = blogs;
//      });
//    };
//
//    $scope.findOne = function() {
//      Blogs.get({
//        blogId: $routeParams.blogId
//      }, function(blog) {
//        $scope.blog = blog;
//      });
//    };

}]);

