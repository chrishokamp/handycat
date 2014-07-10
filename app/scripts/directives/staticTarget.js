// static target is a directive that represents the target when we are NOT EDITING
// WORKING - swap <static-target> with <editable-target> depending upon the state of the segment
angular.module('directives').directive('staticTarget', ['$compile', '$log', function($compile, $log) {
  return {
    restrict: 'E',
    // TODO: add the existing template for a non-active segment - remember to display if it's been translated or not
    template: '<p>{{segment.target}}</p>',
    link: function($scope,el){
      el.on('click', function() {
        $log.log('targetText was clicked...');
        // Working - move to unit test - DON'T PASS LITERAL TEXT TO NG-MODEL
        var newHtml = '<div ng-model="segment.target" ui-ace="{onLoad: aceLoaded}" ng-controller="AceCtrl"></div>'
        var compiledHtml = $compile(newHtml)($scope);
        el.replaceWith(compiledHtml);
      })
    }
  }
}]);

