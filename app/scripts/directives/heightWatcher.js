angular.module('directives').directive('heightWatcher', ['$log', '$timeout', function($log, $timeout) {
  return {
      /*
 * Checks every $digest for height changes
       */
    // ace editor height is: editor.getSession().getDocument().getLength() * editor.renderer.lineHeight + editor.renderer.scrollBar.getWidth()
    link: function( scope, elem, attrs ) {
      $timeout(function() {
        $log.log('CHECKING HEIGHTS');
        $log.log(scope.height.editorHeight);
        $log.log(elem.find('.ace_editor'));
        $log.log('index: ' + scope.index);
        $log.log('my height: ' + elem.height());

        if (elem.height() >= scope.height.editorHeight) {
          scope.height.editorHeight = elem.height();
        }
        else {
          $log.log('inside timeout else');
//          // TODO: remove hard-coded class names
          var syncedClass1 = elem.find('.ace_editor');
          $log.log('synced class');
          $log.log(syncedClass1);
          $log.log('height is: ' + scope.height.editorHeight);
//          var syncedClass2 = elem.find('.content-card');
          syncedClass1.height(scope.height.editorHeight + 500);
//          syncedClass2.height(scope.height.editorHeight);
//
        }
      },2000);

      scope.$watch(
        function() {
          return elem.height();
        },
        function(elemHeight) {
          if (elemHeight >= scope.height.editorHeight) {
            scope.height.editorHeight = elemHeight;
          }
          else {
            $log.log('inside watch else');
//            // TODO: remove hard-coded class names
            var syncedClass1 = elem.find('.ace_editor');
////            var syncedClass2 = elem.find('.content-card');
            syncedClass1.height(scope.height.editorHeight);
////            syncedClass2.height(scope.height.editorHeight);
          }
      });
    }

  }
}]);

