// this directive represents the component at row scope
'use strict';
define(['controllers/controllers'], function(controllers) {
    controllers.controller('RowCtrl', function ($scope) {
      //   TODO:  make directive encapsulating token functionality

      // global which tracks the dragged elements
      // a list of draggable tokens
      $scope.tokens = ["AND", "THERE'S A BARREL", "THAT", "I", "DIDN'T FILL"];
    });
});