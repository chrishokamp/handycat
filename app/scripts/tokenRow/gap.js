// This directive encapsulates a gap which becomes droppable when one of its accepted classes is being dragged
// When a token element is dropped, it is appended *after* this gap element
// <dragUnit><token></token><gap></gap></dragUnit>

'use strict';
define(['../directives/directives'], function(directives){
  directives.directive('gap', function() {
    return {
      restrict: 'EA',
      scope: {},
      link: function(scope, elm, attrs, ctrl) {
        // Add the logic for droppable areas here
        // Create specification function for the allowed draggables?

        // make the newly created gap element droppable
        console.log("linking a new gap element...");
        console.log(elm);
        $(elm).droppable({
          //accept: ".word",
          //activeClass: "ui-state-highlight",
          hoverClass: "drop-hover",
          tolerance: "touch",
          drop: function(ev, ui) {
            var $droppedElem = $(ui.draggable).detach().css({top: 0,left: 0});
            console.log("An element was dropped: ");
            console.log($droppedElem);

            // TODO: be sure to insert after the relevant element - check $(this).parent()
            d("this.parent() is");
            d($(this).parent());
            $(this).parent().after($droppedElem);
            //$droppedElem.before('<div class="gap new">&nbsp</div>');
            //$droppedElem.after('<div class="gap new">&nbsp</div>');

            // Bubble a drop event so that the model can update from the UI state
            // iterate over the .word tokens in #line, and reset the data-index attr
            // TODO: update the scope (update the shared model)
            //var $tokens = $('#line .word');
          }
        })
      }
    }
  });
});
