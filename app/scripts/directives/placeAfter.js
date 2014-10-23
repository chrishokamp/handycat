angular.module('directives').directive('placeAfter', ['$log', function($log) {
  return {
    link: function($scope,el,attrs){
      var afterClass = attrs['placeAfter'];
      var afterElem = el.parent().find('.' + afterClass);
      var topOffset = 10;
      var leftOffset = -6;
      $scope.$watch(
        function() {
          return afterElem.position();
        },
        function(newPos) {
          el.css({'position': 'absolute', 'top': newPos.top + afterElem.height() + topOffset, left: newPos.left + leftOffset})

        },
        true
      )

    }
  }
}]);

