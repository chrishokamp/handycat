// a popover which displays information about a token
angular.module('directives').directive('genderPopover', ['$log', '$timeout', '$compile', function($log, $timeout, $compile) {
  return {
    restrict: 'A',
    scope: true,
    link: function($scope,el, attrs){
      var $infoPopover;

      // test function
      $scope.log = function(str) {
        console.log("LOG GOT: " + str);
        $log.log($scope.$parent.$parent);
        $log.log($scope.changeTokenNumber);
        $scope.changeTokenNumber(str);
      }
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
              '<div ng-click="changeTokenNumber(\'F\')" class="btn btn-primary">F</div>' +
              '<div ng-click="log(\'Apple\')" class="btn btn-primary">F</div>' +
              '<div ng-click="" class="btn btn-primary text-center">M</div>' +
              '<div ng-click="" class="btn btn-primary text-center">N</div>' +
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

