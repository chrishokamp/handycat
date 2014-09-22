angular.module('controllers').controller('UploadCtrl',
  ['$scope', 'fileReader', '$timeout', 'XliffParser', 'Document', '$state', '$log',
  function($scope, fileReader, $timeout, XliffParser, Document, $state, $log) {
// TODO: remember that different file types will require different parsers
// try to select which parser we want based on the file extension

  // does the browser support drag n drop? - assume yes
  $scope.fileAdded = false;
  $scope.dropSupported = false;
  $scope.selectedFiles = [];

  $scope.parser = XliffParser;

  $scope.$watch(
    function() {
      return $scope.dropSupported;
    },
    function() {
      $log.log('UploadCtrl: dropSupported changed to: ' + $scope.dropSupported);
    }
  );

  // make sure that a file has been uploaded, parse it, and transition to translation
  $scope.startTranslation = function() {
    // use the fileReader service to read the file (via the HTML5 FileAPI)
    // assume there's only a single file in the array for now
    XliffParser.readFile($scope.selectedFiles[0]);
// TODO: only initiate this transition if the file is successfully loaded and parsed
    $state.go('projects.translate');
  };

  // Load a specific file from the server
  // TODO: make this function exactly as if the user had loaded a local file
  $scope.loadFileFromServer = function(which) {
    var fileUrl = 'data/' + which;
    // autoload a file
    XliffParser.loadLocalFile(fileUrl);

    // go to the edit state
    $scope.$on('document-loaded', function(e) {
      $state.go('projects.translate');
    });
  };

// TODO: get file type (assume xlf for now)
  $scope.onFileSelect = function ($files) {
    $log.log("inside file select");
    $scope.fileAdded = true;

    // show the user what the selected files are
    // assume this is a single file for now
    $scope.selectedFiles = $files;
    $log.log('SCOPE FILES');
    $log.log($files);

    // parse the file immediately
    XliffParser.readFile($scope.selectedFiles[0]);
  };

// TODO: implement fileProgress from the xliffParser
  $scope.$on("fileProgress", function(e, progress) {
    $scope.progress = progress.loaded / progress.total;
  });

}]);
