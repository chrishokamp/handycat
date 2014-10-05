angular.module('controllers')
.controller('UserSettingsCtrl', ['$scope', '$log', function($scope, $log) {

    $scope.updateUserTausCredentials = function() {
      $log.log('TausUsername: ' + $scope.TausUsername);
      $log.log('TausPassword: ' + $scope.TausPassword);
    }

    // test call to tausdata (test that credentials are valid)

    $scope.$watch(
      function() {
        return $scope.TausUsername
      },
      function() {
        $log.log('TausUsername: ' + $scope.TausUsername);
      }
    )

}]);

