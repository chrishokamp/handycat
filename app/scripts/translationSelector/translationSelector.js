angular.module('directives')
  .directive('translationSelector', ['$log', function($log) {
  return {
    scope: {
      onSelect: '=',
      // a function which will return available translations
      selectorOptions: '='
    },
    templateUrl: 'scripts/translationSelector/translation-selector.html',
    link: function(scope, el, attrs) {

    }
  }
}]);

