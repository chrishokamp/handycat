angular.module('directives')
  .directive('translationSelector', ['$log', function($log) {
  return {
    scope: {
      onSelect: '=',
      selectorOptions: '='
    },
    templateUrl: 'scripts/translationSelector/translation-selector.html',
    link: function(scope, el, attrs) {

    }
  }
}]);

