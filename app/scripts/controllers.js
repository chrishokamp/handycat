angular.module('controllers', ['handycatConfig']);

angular.module('controllers')
.controller('StatsController', ['$scope', 'editSession', function($scope, session) {

  $scope.log = session.log;
  $scope.stats = session.stats;

}]);

