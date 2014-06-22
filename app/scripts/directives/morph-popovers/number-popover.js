angular.module('directives').directive('numberPopover', ['$log', '$timeout', '$compile', '$rootScope', function($log, $timeout, $compile, $rootScope) {
  return {
    restrict: 'A',
    scope: true,
    link: function($scope,el, attrs){
      var $infoPopover;
      $scope.togglePopover = function(evt) {
        $log.log('toggle number popover');
        if ($infoPopover) {
          $infoPopover.remove();
          $infoPopover = undefined;
        } else {
          var offset = el.offset();
          // pad the top
          offset.top += el.height() + 18;
          var popoverHtml =
            '<div class="info-popover text-center">' +
            '<div class="arrow-up"></div>' +
            '<div>' +
              '<div logger="change-number-sin" ng-click="changeTokenNumber(\'Sg\')" class="btn btn-primary" style="width:90px">Singular</div>' +
              '<div logger="change-number-plu" ng-click="changeTokenNumber(\'Pl\')" class="btn btn-primary" style="width:90px">Plural</div>' +
            '</div>' +
            '</div>';

          var compiledHtml = $compile(popoverHtml)($scope);
          $infoPopover = $(compiledHtml);
          // give infoPopover some style
          $infoPopover.css({
//            'height': '100px',
            'top': offset.top+'px',
            'max-width': el.outerWidth()+'px',
            'left': offset.left+'px'
          });
          // style="position: absolute; top:'+offset.top +'px; width:'+ el.outerWidth() + 'px !important; left:'+ offset.left +'px;
          $('body').append($infoPopover);
//          $infoPopover.click(function() {
//            $infoPopover.remove();
//          })
          var oneClick = (function( clickCount ) {
            var handler = function(event) {
              clickCount++;
              if(clickCount >= 2 ) {
                if ($infoPopover) {
                  $infoPopover.remove();
                  $infoPopover = undefined;
                  // remove listener
                }
                document.removeEventListener('click', handler);
                clickCount = 0;
              }
            };
            return handler;
          })( 0 );
          document.addEventListener('click', oneClick);
        }
      }
    }
  }
}]);
