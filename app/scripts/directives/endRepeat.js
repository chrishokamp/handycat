angular.module('directives').directive('endRepeat', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  return function($scope,el){
    if ($scope.$last) {
      $timeout(function() {
        $rootScope.$broadcast('repeat-finished');
      },0);
    }
  }
}]);

