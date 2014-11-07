angular.module('controllers')
.controller('CreateProjectCtrl', ['XliffParser', 'Projects', '$state', '$log', '$scope', '$http', '$mdDialog', function(XliffParser, Projects, $state, $log, $scope, $http, $mdDialog) {

    // set the default title
    $scope.name = 'default-project';

    // make sure the modal closes if we change states
    $scope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
      if (to.name !== 'projects.create') {
        $scope.closeDialog();
      }
    });

    // is the XLIFF already parsed? - there should be a validation check to make sure this is a valid XLIFF
    $scope.create = function() {
      if ($scope.pendingDocument) {
        var project = newProject($scope.name, $scope.pendingDocument);
        project.$save(function(response) {
          $state.go('projects.list');
        });

        $scope.name = "";
      } else {
        console.error('createProject: no pendingDocument on $scope')
      }
    };

    $scope.closeDialog = function() {
      $mdDialog.hide();
    };

    // user specifies the URL of an XLIFF file, we grab it, parse it, then save it on the server
    $scope.createFromURL = function(xliffFileUrl) {
      $log.log('create from URL fired...');
      $http.get(xliffFileUrl)
        .success(function (data) {
          XliffParser.parseXML(data).then(
            function (docObj) {
              var pendingDocument = docObj.DOM;
              var project = newProject($scope.name, pendingDocument)
              $scope.name = "";

              project.$save(function (response) {
                // transition back to the project-list
                $state.go('projects.list');
              });
            });
        });
    }

    var newProject = function (name, pendingDocument) {
      var newProject = new Projects({
        name: $scope.name,
        content: XliffParser.getDOMString(pendingDocument)
      })
      return newProject;
    }

}]);

