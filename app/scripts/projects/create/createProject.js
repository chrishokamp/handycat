angular.module('controllers')
.controller('CreateProjectCtrl', ['$timeout', '$scope', '$rootScope', function($timeout, $scope, $rootScope) {
    // To let close the Single Event modal
    $scope.close = function() {
      $scope.$close(true);
    };

    $scope.validXLIFF = false;
    $scope.documentLoading = false;

    // create the project, and drop to edit mode for that project
    $scope.create = function () {
      // the project data should already be on the scope
      // is the XLIFF already parsed? - there should be a validation check to make sure this is a valid XLIFF

      // this is the current parsing flow
      // autoload a file
      XliffParser.loadLocalFile(fileUrl);

      // go to the edit state
      $scope.$on('document-loaded', function(e) {
        $state.go('edit.segment', { segmentId: 0 });
      });
    }

    // call XliffParser, wait for the document loaded event, then flip the validXLIFF flag on the $scope
    function parse() {
      // TODO: send a promise back from the xliffParser
      $scope.documentLoading = true;
      $scope.$on('document-loaded', function() {
        $scope.validXLIFF = true;
        $scope.documentLoading = false;
      })
    }

    // when a file is added, do the parsing immediately



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

}]);

