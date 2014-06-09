
// a popover which displays information about a token
angular.module('directives').directive('casePopover', ['$log', '$timeout', '$compile', function($log, $timeout, $compile) {
  return {
    restrict: 'A',
    scope: true,
    link: function($scope,el, attrs){
      var $infoPopover;
      $scope.togglePopover = function(evt) {
        $log.log('toggle popover');
        if ($infoPopover) {
          $infoPopover.remove();
          $infoPopover = undefined;
        } else {
          var offset = el.offset();
          // pad the top
          offset.top += el.height() + 18;
          var popoverHtml =
            '<div class="info-popover text-center">' +
              '<div ng-click="changeTokenCase(\'Nom\')" class="btn btn-primary">N</div>' +
              '<div ng-click="changeTokenCase(\'Acc\')" class="btn btn-primary">A</div>' +
              '<div ng-click="changeTokenCase(\'Dat\')" class="btn btn-primary">D</div>' +
              '<div ng-click="changeTokenCase(\'Gen\')" class="btn btn-primary">G</div>' +
            '</div>';
          //          var popoverHtml = '<div data-tooltip-html-unsafe="fun fun" tooltip-trigger="tooltipOpen" class="info-popover">TEST</div>';

          var compiledHtml = $compile(popoverHtml)($scope);
          $infoPopover = $(compiledHtml);
          // give infoPopover some style
          $infoPopover.css({
            'height': '100px',
            'top': offset.top+'px',
            'max-width': el.outerWidth()+'px',
            'left': offset.left+'px'
          });
          // style="position: absolute; top:'+offset.top +'px; width:'+ el.outerWidth() + 'px !important; left:'+ offset.left +'px;
          $('body').append($infoPopover);
        }
      }

    }
  }
}]);