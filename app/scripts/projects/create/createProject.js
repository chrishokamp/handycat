angular.module('controllers')
.controller('CreateProjectCtrl', ['XliffParser', 'Projects', '$state', '$log', '$scope', '$http', '$mdDialog', '$mdToast',
    function(XliffParser, Projects, $state, $log, $scope, $http, $mdDialog, $mdToast) {

      // set the default title
      $scope.name = 'Project Name';

      // add the hard-coded sample files
      $scope.sampleFiles = [
        {name: 'en-de-test1', url: 'data/PEARL_TS1.xlf'},
        {name: 'en-de-test2', url: 'data/PEARL_TS2.xlf'}
      ];

      // make sure the modal closes if we change states
      $scope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
        if (to.name !== 'projects.create') {
          $scope.closeDialog();
        }
      });

      // is the XLIFF already parsed? - there should be a validation check to make sure this is a valid XLIFF
      // the XLIFF parser must reject its promise if there is a parsing error
      $scope.create = function() {
        if ($scope.pendingDocument) {
          var project = newProject(projectName, $scope.pendingDocument);
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

      $scope.showErrorToast = function() {
          var toast = $mdToast.simple()
            .content('Error: Not a Valid XLIFF File')
            .action('OK')
            .highlightAction(true)
            .position('top right');

          $mdToast.show(toast).then(function() {
            $state.go('projects.create')
          });
      };

      $scope.closeToast = function() {
        $mdToast.hide();
      }

      // This is primarily for the built-in demos
      // user specifies the URL of an XLIFF file, we grab it, parse it, then save it on the server
      $scope.createFromURL = function(xliffFileUrl) {
        $log.log('create from URL fired: ' + xliffFileUrl);
        $http.get(xliffFileUrl)
          .success(
          function (data) {
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
          }).
          error(function() {
            // show toast to user letting them know that this is not a valid XLIFF
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

