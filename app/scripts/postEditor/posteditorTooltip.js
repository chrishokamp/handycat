angular.module('handycat.posteditors')
.directive('posteditorTooltip', ['$log', '$compile', '$timeout', function($log, $compile, $timeout) {
    // take the text inside the element, tokenize it, and wrap in spans that we can interact with
    return {
      scope: {
        targetSegment: '=',
        showTooltip: '='
      },
      restrict: 'E',
      templateUrl: 'scripts/postEditor/posteditor-tooltip.html',
      link: function(scope, $el, attrs){
        // WORKING: depending upon what user does with tooltip, take action
        // WORKING: position only after span has been created (use event)
        // WORKING: pass in position with event args?
        scope.$on('position-tooltip', function(e) {
          var $innerSpan = $('.tooltip-span');
          var pos = $innerSpan.position();
          //var width = $innerSpan.outerWidth();
          $el.css({
            position: "absolute",
            top: pos.top + 24 + "px",
            left: (pos.left) + "px",
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

        $scope.moveEvent = function() {
          console.log('Emit move');
          $scope.$emit('move-event')
        }
      }
    };
}]);

