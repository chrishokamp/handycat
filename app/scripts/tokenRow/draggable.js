// attribute-only directive which makes the element draggable
angular.module('directives').directive('draggable' ['$log', function($log) {
  return {
    restrict: 'A',
    scope: {},
    link: function(scope, elm, attrs, ctrl) {
      $log.log("initializing new draggable on element: ");
      $log.log(elm);
      var $elem = $(elm);

      $elem.draggable({
        revert: function(droppable) {
          if (!droppable) {
            $log.log("reverting to orginal position");
            return true;
          } else {
            return false;
          }
        },
        start: function(ev, ui) {
          $log.log("you started dragging a draggable");
          // TODO: disable any droppables attached to this element when the whole element is being dragged
//          var $gaps = $elem.children('.ui-droppable');
//          $gaps.droppable('option', 'disabled', true);

          var $token = $(ev.target);

          // TODO: tests only!
          //$token.addClass('in-drag');
          $token.addClass('i-was-dragged');
          //$token.removeClass('i-was-dragged');

        },
        stop: function(ev, ui) {
          var $gaps = $elem.children('.ui-droppable');
          $gaps.droppable('option', 'disabled', false);

          var $token = $(ev.target);
          //$token.removeClass('in-drag');

        }
      });
    }
  };
}]);
