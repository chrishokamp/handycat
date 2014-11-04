angular.module('controllers')
.controller('CreateProjectCtrl', ['XliffParser', 'Projects', '$state', '$log', '$scope', '$http', '$mdDialog', function(XliffParser, Projects, $state, $log, $scope, $http, $mdDialog) {

    $scope.title = 'default-project';

    // make sure the modal closes if we change states
    $scope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
      if (to.name !== 'projects.create') {
        $scope.closeDialog();
      }
    });

    // is the XLIFF already parsed? - there should be a validation check to make sure this is a valid XLIFF
    $scope.create = function() {
      if ($scope.pendingDocument) {
        var project = new Projects({
          title: $scope.title,
          content: XliffParser.getDOMString($scope.pendingDocument)
        });
        project.$save(function(response) {
          $state.go('projects.list');
        });

        $scope.title = "";
      } else {
        console.error('createProject: no pendingDocument on $scope')
      }
    };

    $scope.closeDialog = function() {
      $mdDialog.hide();
    };

    // user specifies the URL of an XLIFF file, we grab it, parse it, then save it on the server
    // TODO: the XliffParser should return a promise, the translate state should wait for that promise to resolve before rendering
    $scope.createFromURL = function(xliffFileUrl) {
      $log.log('create from URL fired...');
      $http.get(xliffFileUrl)
        .success(function(data) {
          XliffParser.parseXML(data).then(
            function(docObj) {
              var pendingDocument = docObj.DOM;
              var project = new Projects({
                title: $scope.title,
                content: XliffParser.getDOMString(pendingDocument)
              });
              project.$save(function(response) {
                $state.go('projects.list');
              });
              $scope.title = "";
              // transition back to the project-list
            }
          );
        });
    }

}]);

