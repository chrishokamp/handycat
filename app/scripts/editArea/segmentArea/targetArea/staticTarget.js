// this directive dynamically adds the complex targetArea only when it is needed
// this directive shares scope with the segmentArea
angular.module('directives').directive('staticTarget', ['editSession', '$compile', '$log', function(session, $compile, $log) {
  return {
    restrict: 'E',
    templateUrl: 'scripts/editArea/segmentArea/targetArea/static-target.html',
    link: function($scope,el){
      // flag indicating whether components already exist on this element
      $scope.subComponents = {
        componentsExist: false
      };

      // TEST
      $scope.$on('segment-active', function() {
        $log.log('staticTarget heard segment active');
      });
      // make the height the same as the source (max of source+target heights)

      // TODO: adding this component is slow
      // TODO: either we need to load it beforehand (i.e. one segment early), or we need to find the bottleneck (it's probably loading the ace editor)
      // TODO: naively listening for click on this element causes it to be reloaded every time -- first check if the segment is active
      el.on('click', function() {
        $log.log('targetText was clicked...');
        // init the components if they don't exist
        if (!$scope.subComponents.componentsExist) {
          var newHtml = '<div ng-include="\'scripts/editArea/segmentArea/targetArea/target-area.html\'"></div>';
          $log.log(newHtml);
          var compiledHtml = $compile(newHtml)($scope);
          // is $apply necessary because we're in jquery here?
          $scope.$apply(function() {
            el.replaceWith(compiledHtml);
            $scope.componentsExist = true;
          });
        }
        session.setSegment($scope.id.index);
      });

      $scope.$on('activate', function() {
        if (!$scope.subComponents.componentsExist) {
          $log.log('the activate event fired, creating components for segment');
          var newHtml = '<div ng-include="\'scripts/editArea/segmentArea/targetArea/target-area.html\'"></div>';
          var compiledHtml = $compile(newHtml)($scope);
          el.replaceWith(compiledHtml);
          $scope.componentsExist = true;
        }
      });

    }
  }
}]);

