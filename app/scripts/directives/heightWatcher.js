angular.module('directives').directive('heightWatcher', ['$log', '$timeout', function($log, $timeout) {
  return {
      /*
 * Checks every $digest for height changes
       */
    // ace editor height is: editor.getSession().getDocument().getLength() * editor.renderer.lineHeight + editor.renderer.scrollBar.getWidth()
    link: function( scope, elem, attrs ) {
      $timeout(function() {

        if (elem.height() >= scope.height.editorHeight) {
          scope.height.editorHeight = elem.height();
        } else {
          var syncedClass1 = elem.find('.ace_editor');
          var syncedClass2 = elem.find('.content-card');
          syncedClass1.height(scope.height.editorHeight);
          syncedClass2.height(scope.height.editorHeight - 30);
        }
      },0);
      scope.$watch( function() {
        if (elem.height() >= scope.height.editorHeight) {
          scope.height.editorHeight = elem.height();
        } else {
          var syncedClass1 = elem.find('.ace_editor');
          var syncedClass2 = elem.find('.content-card');
          syncedClass1.height(scope.height.editorHeight);
          syncedClass2.height(scope.height.editorHeight - 30);
        }
      } );
    }

  }
}]);

