angular.module('handycat.posteditors')
.directive('posteditorTooltip', ['$log', '$compile', '$timeout', function($log, $compile, $timeout) {
    // take the text inside the element, tokenize it, and wrap in spans that we can interact with
    return {
      scope: {
        selectedText: '@',
        //transclude: true
        //onRemove: '&'
      },
      restrict: 'E',
      templateUrl: 'scripts/postEditor/posteditor-tooltip.html',
      link: function(scope, $el, attrs){
        // WORKING: depending upon what user does with tooltip, take action
        console.log('POST EDITOR TOOLTIP');
        var $innerSpan = $el.find('span').first()
        var pos = $innerSpan.position();
        var width = $innerSpan.outerWidth();
        $('.post-editor-menu').css({
          position: "absolute",
          top: pos.top + 24 + "px",
          //left: (pos.left + width) + "px"
          left: (pos.left) + "px",
          display: "block"
        });

      },
      controller: function($scope) {
        $scope.showTooltip = false;
        $timeout(function() {
          $scope.showTooltip = true;
        },0);

        $scope.toggleTooltip = function() {
          $scope.showTooltip = !$scope.showTooltip;
        }
        $scope.userState = '';
        $scope.actionStates = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; });
      }
    };
}]);

