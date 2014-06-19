angular.module('directives').directive('logger', ['project', 'Document', '$log', function(project, Document, $log) {
  return {
    restrict: 'A',
    scope: true,
    link: function($scope, elem, attrs) {
      // the default event to watch is 'click'
      var eventName = 'click';
      if (attrs.loggerEvent) {
        eventName = attrs.loggerEvent;
      }

      if (eventName === 'click') {
        elem.bind('click', loggerCallback);
      } else {
        // custom events within the angular app
        $scope.$on(eventName, loggerCallback);
      }

      // you can get any extra data from the event object
      function loggerCallback(e) {
        var action = attrs.logger;
        var index = $scope.index;

        // Note: this is likely to be the _current_ target, because the callbacks haven't finished yet
        // the ace editor input event can be used to get the new value
        var target = Document.targetSegments[index];
        project.updateStat(action, index, target);
      }

      $scope.callback = loggerCallback;
    }

  };
}]);
