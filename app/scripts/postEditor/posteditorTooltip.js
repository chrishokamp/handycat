angular.module('handycat.posteditors')
.directive('posteditorTooltip', ['$log', '$compile', '$timeout', function($log, $compile, $timeout) {
    // take the text inside the element, tokenize it, and wrap in spans that we can interact with
    return {
      scope: {
        targetSegment: '=',
        showTooltip: '='
        //selectedText: '@',
        //transclude: true
        //onRemove: '&'
      },
      restrict: 'E',
      templateUrl: 'scripts/postEditor/posteditor-tooltip.html',
      link: function(scope, $el, attrs){
        // WORKING: depending upon what user does with tooltip, take action
        // WORKING: position only after span has been created (use event)
        // WORKING: pass in position with event args?
        scope.$on('position-tooltip', function(e) {
          console.log('POSITION TOOLTIP');
          var $innerSpan = $('.tooltip-span');
          var pos = $innerSpan.position();
          var width = $innerSpan.outerWidth();
          console.log(pos);
          $el.css({
            position: "absolute",
            top: pos.top + 24 + "px",
            //left: (pos.left + width) + "px"
            left: (pos.left) + "px",
            //display: "block"
          });
          scope.showTooltip = true;

        });

      },
      controller: function($scope) {
        $scope.deleteEvent = function() {
          console.log('Emit deleted');
          $scope.$emit('delete-event')
        }

        $scope.replaceEvent = function() {
          console.log('Emit replace');
          $scope.$emit('replace-event')
        }

        $scope.toggleTooltip = function() {
          $scope.showTooltip = !$scope.showTooltip;
        }
      }
    };
}]);

