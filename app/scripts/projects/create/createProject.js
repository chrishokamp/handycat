angular.module('controllers')
.controller('CreateProjectCtrl', ['Document', 'XliffParser', 'Projects', '$state', '$log', '$scope', '$http', function(Document, XliffParser, Projects, $state, $log, $scope, $http) {

    $scope.title = 'default-project';

    $scope.close = function() {
      $scope.$close(true);
    };

    $scope.validXLIFF = false;
    $scope.documentLoading = false;

    // TODO: this function is currently unused
      // TODO: send a promise back from the xliffParser instead of using events
    // when a file is added, do the parsing immediately
    // call XliffParser, wait for the document loaded event, then flip the validXLIFF flag on the $scope
    function parse() {
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

    // is the XLIFF already parsed? - there should be a validation check to make sure this is a valid XLIFF
    $scope.create = function() {
      var project = new Projects({
        title: $scope.title,
        content: Document.getDOMString()
      });
      project.$save(function(response) {
        $state.go('projects.list');
      });

      $scope.title = "";
    };

    // WORKING: refactor the Document service so that the .translate state always initializes a new controller
    // TODO: there should NOT be a global Document object in the app
    // user specifies the URL of an XLIFF file, we grab it, parse it, then do Document.getDOMString()
    // TODO: we need to go to the .translate state once the file is parsed
    // the XliffParser should return a promise, the translate state should wait for that promise to resolve before rendering
    $scope.createFromURL = function(xliffFileUrl) {
      $log.log('create from URL fired...');
      $http.get(xliffFileUrl)
        .success(function(data) {
          XliffParser.parseXML(data);
        });

      // transition back to the project-list
      $scope.$on('document-loaded', function(e) {
        var project = new Projects({
          title: $scope.title,
          content: Document.getDOMString()
        });
        project.$save(function(response) {
          $state.go('projects.list');
        });
        $scope.title = "";
      });
    }

}]);

