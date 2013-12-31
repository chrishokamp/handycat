'use strict';
define(['controllers/controllers'], function(controllers) {
  controllers.controller('MainCtrl', function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
  });
});

