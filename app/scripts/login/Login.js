angular.module('controllers')
.controller('LoginCtrl', ['$scope', 'Auth', '$location', function($scope, Auth, $location) {
    $scope.error = {};
    $scope.user = {};

    $scope.login = function(form) {
      Auth.login('password', {
          'email': $scope.user.email,
          'password': $scope.user.password
        },
        function(err) {
          $scope.errors = {};

          if (!err) {
            // Chris: redirect to the entry point of the application after login
            $location.path('/project');
          } else {
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.type;
            });
            $scope.error.other = err.message;
          }
      });
    };

}]);

