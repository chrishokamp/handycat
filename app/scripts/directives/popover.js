// a popover which displays information about a token
angular.module('directives').directive('popover', ['$log', function($log) {
  return {
    restrict: 'A',
    link: function($scope,el){
      var $infoPopover;
      el.hover(
        function(evt) {
          var offset = el.offset();
          // pad the top
          offset.top +=18;
          var popoverHtml = '<div class="info-popover" style="top:'+offset.top +'px; left:'+ offset.left +'px;">TEST</div>';
          $infoPopover = $(popoverHtml);
          $log.log('you are hovering over a popover element');
          $('body').append($infoPopover);
        },
        function(evt) {
          $infoPopover.remove();
        }
      );
    }
  }
}]);

