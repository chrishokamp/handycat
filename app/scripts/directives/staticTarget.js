// this directive dynamically adds the complex targetArea only when it is needed
angular.module('directives').directive('staticTarget', ['$compile', '$log', function($compile, $log) {
  return {
    restrict: 'E',
    // TODO: add the existing template for a non-active segment - remember to display if it's been translated or not
    // WORKING: pending, active, and completed are segment-level properties, and should be handled there
    template: '<p class="source">{{segment.target}}</p>',
    link: function($scope,el){
      $scope.index = $scope.id.index;
      el.on('click', function() {
        $log.log('targetText was clicked...');
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

