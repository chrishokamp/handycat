angular.module('controllers')
.controller('LoginCtrl', ['$scope', 'Auth', '$location', function($scope, Auth, $location, $timeout) {
    $scope.error = {};
    $scope.user = {};

    if ($scope.currentUser) {
      $location.path('/projects');
    }

    $scope.login = function(form) {
      Auth.login('password', {
          'email': $scope.user.email,
          'password': $scope.user.password
        },
        function(err) {
          $scope.errors = {};

          if (!err) {
            // Chris: redirect to the entry point of the application after login
            $location.path('/projects');
          } else {
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.type;
            });
            $scope.error.other = err.message;
          }
      });
    };

    // check if user is logged-in right when we hit this page
//    $timeout(function() {
////      $scope.login();
//      $location.path('/projects')
//    },0);

}]);

