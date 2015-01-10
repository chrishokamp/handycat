angular.module('controllers', []);

angular.module('controllers')
.controller('StatsController', ['$scope', 'editSession', function($scope, session) {

  $scope.log = session.log;
  $scope.stats = session.stats;

}]);

