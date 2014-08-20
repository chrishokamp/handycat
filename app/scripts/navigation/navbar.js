'use strict';

angular.module('controllers')
  .controller('NavbarCtrl', ['$scope', 'Auth', '$location', function ($scope, Auth, $location) {
    $scope.menu = [{
      "title": "Projects",
      "link": "projects"
    }];

    $scope.authMenu = [{
      "title": "Create New Project",
      "link": "projects/create"
    }];

    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/login');
        }
      });
    };
  }]);
