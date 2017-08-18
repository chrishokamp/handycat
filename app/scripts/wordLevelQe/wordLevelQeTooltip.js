angular.module('handycat.wordLevelQe')
.directive('wordLevelQeTooltip', ['$log', '$compile', '$timeout', function($log, $compile, $timeout) {
    // take the text inside the element, tokenize it, and wrap in spans that we can interact with
    return {
      scope: {
        targetSegment: '=',
        showTooltip: '='
      },
      restrict: 'E',
      templateUrl: 'scripts/wordLevelQe/wordLevelQe-tooltip.html',
      link: function(scope, $el, attrs){

        // depending upon what user does with tooltip, take action
        // position only after span has been created (use event)
        scope.$on('position-tooltip', function(e) {
          // Note: this is currently hard-coded
          var tooltipWidth = 90;
          var $innerSpan = $('.tooltip-span');
          var pos = $innerSpan.parent().position();

          // check if we're going outside the target area, if so, offset the tooltip
          var $targetArea = $innerSpan.closest('.post-editor-wrapper');
          var targetAreaLeft = $targetArea.position().left;
          var topRightCorner = targetAreaLeft + $targetArea.width();
          var toolTipRightCorner = targetAreaLeft + pos.left + tooltipWidth;
          var cornerDiff = topRightCorner - toolTipRightCorner;
          var tooltipOffset = 0;
          if (cornerDiff < 0) {
            tooltipOffset = cornerDiff;
          }
          $el.css({
            position: "absolute",
            top: pos.top + 24 + "px",
            left: (pos.left + tooltipOffset) + "px",
          });
        });

      },
      controller: function($scope) {
        $scope.deleteEvent = function() {
          console.log('Emit deleted');
          $scope.$emit('delete-event')
        }

        $scope.insertEvent = function() {
          console.log('Emit insert');
          $scope.$emit('insert-event')
        }

        $scope.replaceEvent = function() {
          console.log('Emit replace');
          $scope.$emit('replace-event')
        }

        $scope.confirmEvent = function() {
            console.log('Emit confirm');
            $scope.$emit('confirm-event')
        }

        $scope.moveEvent = function() {
          console.log('Emit move');
          $scope.$emit('move-event')
        }
      }
    };
}]);

