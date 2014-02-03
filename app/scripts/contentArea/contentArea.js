'use strict';
// Holds all of the translation pairs and handles the interface with the Document service
define(['controllers/controllers'], function(controllers) {

  controllers.controller('ContentAreaCtrl', ['$scope', 'Document', '$log', function($scope, Document, $log) {
    $scope.segments = Document.segments;

    // watch the flag
    $scope.$watch(function() {
        return Document.loaded;
      },
      function() {
        $log.log("Number of segments in document: " + Document.segments.length);
        $scope.segments = Document.segments;
      }
    );



  }]);
});