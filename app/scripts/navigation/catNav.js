angular.module('directives').directive('catNav', ['$log', function($log) {
  return {
    restrict: 'E',
    replace: 'true',
//    templateUrl: 'catNav.html',
    templateUrl: 'scripts/navigation/catNav.html',
    link: function($scope,el){
      $log.log('inside cat tool navigation directive');
    }
  }
}]);

