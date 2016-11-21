angular.module('handycat.posteditors')
.directive('qeScore', ['$log', '$compile', '$timeout', function($log, $compile, $timeout) {
    return {
      scope: {
        //targetSegment: '=',
        //isActive: '=',
        //logAction: '&'
      },
      templateUrl: 'scripts/qeScore/qeScore.html',
      restrict: 'E',
      link: function(scope, $el, attrs) {

        //scope.state = {
        //  'action'   : 'default',
        //  'undoStack': [scope.targetSegment]
        //}

      },
      controller: function($scope) {
        //$scope.setSurfaceForms = function(e) {
        //  var surfaceForm = $(e.target).text();
        //  $scope.$emit('find-surface-forms', { 'sf': surfaceForm });
        //}

      }
    };
}]);

