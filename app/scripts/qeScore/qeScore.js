angular.module('handycat.posteditors')
.directive('qeScore', ['$log', '$compile', '$timeout', function($log, $compile, $timeout) {
    return {
      scope: {
        numericalQeScore: '@',
      },
      templateUrl: 'scripts/qeScore/qeScore.html',
      restrict: 'E',
      link: function(scope, $el, attrs) {
        // WORKING: component doesn't show if score is undefined(?)

      },
      controller: function($scope) {

      }
    };
}]);

