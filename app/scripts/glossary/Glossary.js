// Controller for any element that uses the glossary service
// TODO: define live template before proceeding

// Working notes:
// bind to $scope.sourceWord - set that from the directive
// in the directive, set $scope.sourceWord from the element's text content
// when the element loses focus (on blur), then close the tooltip

// todo: this should be a directive which maps the source word to any matches in the glossary (typeahead too)
// todo: look at the scopes sourceWord to query the glossary (ask each time since the Glossary may update)
angular.module('controllers').controller('GlossaryCtrl', ['$scope', 'Glossary', function($scope, Glossary) {

  $scope.makeHtml = function(wordList) {
    var out = "";
    Glossary.words.forEach(function(word) {
      out += '<div>' + word + '</div>';
    });
    return out;
  }
// TODO: we need the popover to listen for clicks on its elements
// TODO: the ui-tooltip component supports html content via tooltip-html-unsafe

  $scope.content = '<ul><li>TEST HTML</li><li>TEST HTML</li><li>TEST HTML</li></ul>';
  $scope.contentFunc = function(){
    '<ul><li>TEST HTML</li><li>TEST HTML</li><li>TEST HTML</li></ul>';
  }



}]);
