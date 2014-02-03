'use strict';
define(['controllers/controllers'], function(controllers) {

// TODO: remove or rename fileReader?
// TODO: remove document service -- this controller should change route once the document has loaded
  controllers.controller('UploadCtrl', ['$scope', 'fileReader', '$timeout', 'XliffParser', 'Document', '$log', function($scope, fileReader, $timeout, XliffParser, Document, $log) {
// TODO: remember that different file types will require different parsers

    var development = true;
  // Dev flag - load file by default
    if (development) {
      var fileUrl = 'data/enEs.xlf';
      $log.log("IN DEVELOPMENT MODE - loading local file: " + fileUrl);

      // autoload a file
      XliffParser.loadLocalFile(fileUrl);

// Example files - TODO: repurpose for testing
//      var example_path = "examples/";
//      var task_path = "examples/tasks/";
//      var lang_path = "es/";
//      var xliff_file = "";

    }

    // does the browser support drag n drop?
    $scope.dropSupported = true;

// get the file name, and let the parsing service handle the rest (service should have a function for each file type
// Once the file is parsed, the parsed data should be set on the Document service
// TODO: parse a local xml file - see the escriba project
// Parsing on the server is also a perfectly valid option
// server needs to know how to synchronize with the file format at all times
// TODO: this should actually change the route using ui-router
    $scope.$on('DocumentLoaded', function (event) {
      d("UploadCtrl: DocumentLoaded")
      $scope.parsed = Document.segments;
    });

// TODO: get file type
    $scope.onFileSelect = function ($files) {
      d("inside file select");
      //$files: an array of files selected, each file has name, size, and type.
      for (var i = 0; i < $files.length; i++) {
        $scope.progress = 0;
        var file = $files[i];
        d("Logging the file:")
        d(file);
        // use the fileReader service to read the file (via the HTML5 FileAPI)
        XliffParser.readFile(file)
      }
    };

// TODO: TESTING ONLY
    $scope.$on("fileProgress", function(e, progress) {
      $scope.progress = progress.loaded / progress.total;
    });

    // for angular-file-upload (copied from github https://github.com/danialfarid/angular-file-upload)
    //    // TODO: repurpose this for local upload
    //    $scope.upload = $upload.upload({
    //      url: 'server/upload/url', //upload.php script, node.js route, or servlet url
    //      // method: POST or PUT,
    //      // headers: {'headerKey': 'headerValue'}, withCredential: true,
    //      //data: {: $scope.myModelObj}, //Chris: this is a model object that you can optionally send with the file
    //      file: file
    //      // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
    //      /* set file formData name for 'Content-Desposition' header. Default: 'file' */
    //      //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
    //      /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
    //      //formDataAppender: function(formData, key, val){}
    //    }).progress(function(evt) {
    //        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
    //      }).success(function(data, status, headers, config) {
    //        // file is uploaded successfully
    //        console.log(data);
    //      });
    //    //.error(...)
    //    //.then(success, error, progress);
    //  }
    //};
  }]);
});

