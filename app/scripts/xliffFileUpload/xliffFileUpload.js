// TODO: remove document service -- this controller should change route once the document has loaded
angular.module('controllers').controller('UploadCtrl',
  ['$scope', 'fileReader', '$timeout', 'XliffParser', 'Document', '$state', '$log',
  function($scope, fileReader, $timeout, XliffParser, Document, $state, $log) {
// TODO: remember that different file types will require different parsers


  // does the browser support drag n drop?
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
// TODO: set the current file on one of the services to persist it through the session
    XliffParser.readFile($scope.selectedFiles[0]);
// TODO: only initiate this transition if the file is successfully loaded and parsed
    $state.go('edit');
  };

  // Load a specific file from the server
  $scope.loadFileFromServer = function(which) {
    var fileUrl = 'data/' + which;
    // autoload a file
    XliffParser.loadLocalFile(fileUrl);

    // go to the edit state
    $scope.$on('document-loaded', function(e) {
      $state.go('edit');
    });
  };

  // DEVELOPMENT UTILITY
  var development = false;
// Dev flag - load file by default
  if (development) {
//    var fileUrl = 'data/enEs.xlf';
//    var fileUrl = 'data/enDe.xlf';
//    var fileUrl = 'data/enDeSmall.xlf';
    //var fileUrl = 'data/dublin.xlf';
    var fileUrl = 'data/PEARL_TS2.xlf';
    $log.log("IN DEVELOPMENT MODE - loading local file: " + fileUrl);

    // autoload a file
    XliffParser.loadLocalFile(fileUrl);

    // go to the edit state
    $scope.$on('document-loaded', function(e) {
      $state.go('edit.segment', { segmentId: 0 });
    });
  }

// TODO: get file type (assume xlf for now)
  $scope.onFileSelect = function ($files) {
    $log.log("inside file select");
    $scope.fileAdded = true;

    // show the user what the selected files are
    // assume this is a single file for now
    $scope.selectedFiles = $files;

    //$files: an array of files selected, each file has name, size, and type.
// TODO: support multiple files?
//    for (var i = 0; i < $files.length; i++) {
//      $scope.progress = 0;
//      var file = $files[i];
//      //$log.log("Logging the file:")
//      //$log.log(file);
//
//    }
  };

// TODO: implement fileProgress from the xliffParser
  $scope.$on("fileProgress", function(e, progress) {
    $scope.progress = progress.loaded / progress.total;
  });

}]);
