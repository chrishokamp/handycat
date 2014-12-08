// this directive dynamically adds the complex targetArea only when it is needed
angular.module('directives').directive('staticTarget', ['editSession', '$compile', '$log', function(session, $compile, $log) {
  return {
    restrict: 'E',
    // WORKING: pending, active, and completed are segment-level properties, and should be handled there
    template: '<div class="content-card"><div class="target">{{segment.target}}</div></div>',
    link: function($scope,el){
      $scope.index = $scope.id.index;
      // make the height the same as the source (max of source+target heights)

      // TODO: adding this component is slow
      // TODO: either we need to load it beforehand (i.e. one segment early), or we need to find the bottleneck

      el.on('click', function() {
        $log.log('targetText was clicked...');
        var newHtml = '<ng-include src="\'scripts/editArea/contentArea/segmentArea/targetArea/target-area.html\'"></div>'
        var compiledHtml = $compile(newHtml)($scope);
        el.replaceWith(compiledHtml);
        session.setSegment($scope.index);
      });

      $scope.$on('activate', function() {
        $log.log('the activate event fired');
        var newHtml = '<ng-include src="\'scripts/editArea/contentArea/segmentArea/targetArea/target-area.html\'"></div>'
        var compiledHtml = $compile(newHtml)($scope);
        el.replaceWith(compiledHtml);
      });

    }
  }
}]);

