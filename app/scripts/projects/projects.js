angular.module('controllers')
.controller('ProjectCtrl', ['$scope', function($scope) {
    $scope.projects = [
      { "name": "test-project1"},
      { "name": "test-project2"},
      { "name": "test-project3"},
    ];
}]);

