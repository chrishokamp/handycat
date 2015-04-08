angular.module('controllers')
.controller('CreateProjectCtrl', ['XliffParser', 'fileReader', 'Projects', 'xliffCreatorUrl', '$state', '$log', '$scope', '$http', '$mdDialog', '$mdToast',
    function(XliffParser, fileReader, Projects, xliffCreatorUrl, $state, $log, $scope, $http, $mdDialog, $mdToast) {

      // set the default title
      $scope.name = undefined;
      $scope.pending = {
        document: undefined
      }

      // add the hard-coded sample files
      $scope.sampleFiles = [
        {name: 'en-de-test1', url: 'data/PEARL_TS1.xlf'},
        {name: 'en-de-test2', url: 'data/PEARL_TS2.xlf'}
      ];

      // make sure the create modal closes if we change states
      $scope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
        if (to.name !== 'projects.create') {
          $scope.closeDialog();
        }
      });

      // is the XLIFF already parsed? - there should be a validation check to make sure this is a valid XLIFF
      // the XLIFF parser must reject its promise if there is a parsing error
      $scope.create = function() {
        if (!$scope.name || $scope.name.length === 0) {
          $scope.showErrorToast('Please give your project a name!');
        }
        if ($scope.pending.document) {
          var project = newProject(projectName, $scope.pending.document);
          project.$save(function(response) {
            $state.go('projects.list');
          });

          $scope.name = "";
        } else {
          console.error('createProject: no pendingDocument on $scope');
          $scope.showErrorToast('Error: no XLIFF file available');
        }
      };

      $scope.closeDialog = function() {
        $mdDialog.hide();
      };

      $scope.showErrorToast = function(msg) {
          var toast = $mdToast.simple()
            .content(msg)
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
      $scope.createFromURL = function(xliffFileUrl, projectName) {
        $log.log('create from URL fired: ' + xliffFileUrl);
        $http.get(xliffFileUrl)
          .success(
          function (data) {
            XliffParser.parseXML(data).then(
              function (docObj) {
                var pendingDocument = docObj.DOM;
                if ($scope.name === "" || $scope.name === undefined) {
                  $scope.name = projectName;
                }
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
            $scope.showErrorToast('Error: Xliff parsing failed - did you specify an XLIFF file?');
          });
      }

      var newProject = function (name, pendingDocument) {
        var newProject = new Projects({
          name: $scope.name,
          content: XliffParser.getDOMString(pendingDocument)
        })
        return newProject;
      }

      // does the browser support drag n drop? - assume yes
      $scope.fileAdded = false;
      $scope.dropSupported = false;
      $scope.selectedFiles = [];

      $scope.$watch(
        function() {
          return $scope.dropSupported;
        },
        function() {
          $log.log('UploadCtrl: dropSupported changed to: ' + $scope.dropSupported);
        }
      );

// TODO: this code depends upon $scope.pending.document being available
// TODO: refactor this component into a directive
      // this depends on ngFileUpload (selectedFiles is used by ngFileUpload)
      $scope.onFileSelect = function ($files) {
        $scope.fileAdded = true;

        // show the user what the selected files are
        $scope.selectedFiles = $files;

        // assume this is a single file for now
        var selectedFile = $files[0];

        // get the file extension
        var filetype = getFiletype(selectedFile);
        if (filetype === 'xlf' || filetype === 'xliff') {
          createFromXliffFile(selectedFile);
        } else {
          createFromTextFile(selectedFile);
        }
      };

      var getFiletype = function(file) {
        return file.name.split('.').pop();
      }

      var createFromXliffFile = function(file) {
        // parse the file then set $scope.pending.document to the parsed XLIFF string
        var xliffPromise = XliffParser.readFile($scope.selectedFiles[0]);
        xliffPromise.then(
          function(documentObj) {
            $scope.pending.document = documentObj.DOM;
          }
        );
      }

      // TODO: user MUST specify source and target langs for this to work
      // TODO: we force XLIFF 1.2 because 2.0 isn't supported yet
      // TODO: chain these promises
      var createFromTextFile = function(file) {
        // parse the text file with the webservice, then set $scope.pending.document to the parsed XLIFF string
        var readerProm = fileReader.readAsText(file);

        readerProm.then(
          createFromRawText(rawText),
          function(err) {
            $log.error('Error reading local text file');
          }
        );
      }

      var createFromRawText = function(rawText) {
        var documentProm = $http({
          url   : xliffCreatorUrl,
          method: "GET",
          params: {
            sourceLang: 'en-US',
            targetLang: 'de-DE',
            sourceText: rawText
          }
        });
        documentProm.then(
          function (res) {
            var xliffPromise = XliffParser.parseXML(res.data);
            xliffPromise.then(
              function (documentObj) {
                $scope.pending.document = documentObj.DOM;
                // TODO: this is a hack, since we actually aren't dealing with a file here
                $scope.selectedFiles = ['dummyFile'];
              },
              function(err) {
                $log.error('There was an error parsing the raw text into XLIFF');
                $scope.showErrorToast('There was an error converting your text to XLIFF 1.2');
              }
            );
          }, function (err) {
            $log.error('createProject: error parsing text');
            // show modal
            $scope.showErrorToast('There was an error converting your text to XLIFF 1.2');
          }
        );
      }

//.controller('AppCtrl', function($scope, $mdDialog) {
  $scope.alert = '';
  $scope.showAdvanced = function(evt) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/partials/projects/raw-text-dialog.tmpl.html',
      targetEvent: evt
    })
      .then(function(rawText) {
        createFromRawText(rawText);
      }, function() {
        $log.log('inner dialog cancelled');
      });
  };
//});
function DialogController($scope, $mdDialog) {
  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  $scope.createFromText = function (rawText) {
    $mdDialog.hide(rawText);
  };
}

}]);
