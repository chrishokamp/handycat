// this directive dynamically adds the complex targetArea only when it is needed
angular.module('directives').directive('staticTarget', ['editSession', '$compile', '$log', function(session, $compile, $log) {
  return {
    restrict: 'E',
    templateUrl: 'scripts/editArea/segmentArea/targetArea/static-target.html',
    link: function($scope,el){
      // make the height the same as the source (max of source+target heights)

      // TODO: adding this component is slow
      // TODO: either we need to load it beforehand (i.e. one segment early), or we need to find the bottleneck (it's probably loading the ace editor)
      el.on('click', function() {
        $log.log('targetText was clicked...');
        var newHtml = '<div ng-include="\'scripts/editArea/segmentArea/targetArea/target-area.html\'"></div>';
        $log.log(newHtml);
        var compiledHtml = $compile(newHtml)($scope);
        // is $apply necessary because we're in jquery here?
        $scope.$apply(function() {
          el.replaceWith(compiledHtml);
          session.setSegment($scope.id.index);
        });
      });

      $scope.$on('activate', function() {
        $log.log('the activate event fired');
        var newHtml = '<div ng-include="\'scripts/editArea/segmentArea/targetArea/target-area.html\'"></div>';
        var compiledHtml = $compile(newHtml)($scope);
        el.replaceWith(compiledHtml);
      });

    }
  }
}]);

