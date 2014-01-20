'use strict';
define(['controllers/controllers'], function(controllers) {

  controllers.controller('UploadCtrl', function($scope, fileReader) {

// TODO: parse a local xml file - see the escriba project
// TODO: think about how to implement the client side parser(s)
// Parsing on the server is also a perfectly valid option
// server needs to know how to synchronize with the file format at all times

    // reader.readAsText(f);


    console.log(fileReader)
    $scope.getFile = function () {
      $scope.progress = 0;
      // FOR A TEXT FILE
      fileReader.readAsText($scope.file, $scope)
        .then(function(result) {
          $scope.textFromFile = result;
        });

      // FOR IMAGES
      //fileReader.readAsDataUrl($scope.file, $scope)
      //  .then(function(result) {
      //    $scope.imageSrc = result;
      //  });
    };

    $scope.$on("fileProgress", function(e, progress) {
      $scope.progress = progress.loaded / progress.total;
    });
  });
});

