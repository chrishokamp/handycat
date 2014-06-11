angular.module('directives').directive('logger', ['project', 'Document', function(project, Document) {
  return {
    restrict: 'A',

    link: function($scope, elem, attrs) {
      elem.bind('click', function(e) {
        var action = attrs.logger;
        var index = $scope.index;
        var target = Document.targetSegments[index];
        project.updateStat(action, index, target);
      });
    }

  };
}]);
