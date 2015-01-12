angular.module('directives').directive('translationItem', ['$log', function($log) {
  return {
    scope: {
      item: '=',
      // evaluate on select in the context of the parent scope
      onSelect: '='
    },
    templateUrl: 'scripts/translationSelector/translation-item.html',
    link: function($scope, el, attrs) {
      var getColor = function (qualityScore) {
        if (qualityScore <= 0.4) {
          return 'red';
        }
        else if (qualityScore <= 0.75) {
          return 'yellow';
        }
        return 'green';
      }

      var color = getColor($scope.item.quality);
      el.find('.quality-indicator').css('background-color', color);
    }
  }
}]);


