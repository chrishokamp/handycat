// a popover which displays information about a token
angular.module('directives').directive('popover', ['$log', '$timeout', function($log, $timeout) {
  return {
    restrict: 'A',
    link: function($scope,el){
      var $infoPopover;
      el.hover(
        function(evt) {
          var offset = el.offset();
          // pad the top
          offset.top +=18;
//          var popoverHtml = '<div class="info-popover" style="position: absolute; top:'+offset.top +'px; left:'+ offset.left +'px;">TEST</div>';
          var popoverHtml = '<div data-tooltip-html-unsafe="fun fun" tooltip-trigger="tooltipOpen" class="info-popover">TEST</div>';
          var compiledHTML = $compile(popoverHtml)($scope);
          $infoPopover = $(popoverHtml);
          $log.log('you are hovering over a popover element');
          el.append(compiledHTML);
        },
        function(evt) {
          $infoPopover.remove();
        }
      );
    }
  }
}]);

