'use strict';
// Holds all of the translation pairs and handles the interface with the Document service
define(['controllers/controllers'], function(controllers) {

  controllers.controller('ContentAreaCtrl', ['$scope', 'Document', function($scope, Document) {
    $scope.segments = Document.segments;
    $scope.$watch(function() {
      return Document.segments.length;
    },
      function() {
        $scope.segments = Document.segments;
        //$scope.$apply();
      });

  }]);
});