// a popover which displays information about a token
angular.module('directives').directive('popover', ['$log', '$timeout', '$compile', function($log, $timeout, $compile) {
  return {
    restrict: 'A',
    link: function($scope,el){
      var $infoPopover;
      $scope.actions = []

      $scope.togglePopover = function(evt) {
        if ($infoPopover) {
          $infoPopover.remove();
          $infoPopover = undefined;
        } else {
          var offset = el.offset();
          // pad the top
          offset.top += el.height() + 18;
          var popoverHtml = '<div class="info-popover" style="position: absolute; top:'+offset.top +'px; width:'+ el.outerWidth() + 'px; left:'+ offset.left +'px;"></div>';
          //          var popoverHtml = '<div data-tooltip-html-unsafe="fun fun" tooltip-trigger="tooltipOpen" class="info-popover">TEST</div>';
          var compiledHTML = $compile(popoverHtml)($scope);
          $infoPopover = $(popoverHtml);
          // give infoPopover some style
          $infoPopover.height(100);
          $log.log('you are hovering over a popover element');
          $('body').append($infoPopover);
        }
      }

      // test function
      $scope.log = function() {
        console.log('TEST SUCCESSFUL');
      }
    }
  }
}]);

