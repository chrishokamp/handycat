// this directive dynamically adds the complex targetArea only when it is needed
angular.module('directives').directive('staticTarget', ['session', '$compile', '$log', function(session, $compile, $log) {
  return {
    restrict: 'E',
    // WORKING: pending, active, and completed are segment-level properties, and should be handled there
    template: '<div class="content-card frame"><div class="target">{{segment.target}}</div></div>',
    link: function($scope,el){
      $scope.index = $scope.id.index;
      // make the height the same as the source (max of source+target heights)

      el.on('click', function() {
        $log.log('targetText was clicked...');
        // TODO: don't scroll when the segment is activated in this way
        session.setSegment($scope.index);
        var newHtml = '<ng-include src="\'scripts/directives/target-area.html\'"></div>'
        var compiledHtml = $compile(newHtml)($scope);
        el.replaceWith(compiledHtml);
        $log.log('new element:');
        $log.log(el);
      });

      $scope.$on('activate', function() {
        $log.log('targetText was clicked...');
        var newHtml = '<ng-include src="\'scripts/directives/target-area.html\'"></div>'
        var compiledHtml = $compile(newHtml)($scope);
        el.replaceWith(compiledHtml);
        $log.log('new element:');
        $log.log(el);

      });

    }
  }
}]);

