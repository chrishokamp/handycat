// static target is a directive that represents the target when we are NOT EDITING
// WORKING - swap <static-target> with <editable-target> depending upon the state of the segment
angular.module('directives').directive('staticTarget', ['$log', function($log) {
  return {
    restrict: 'E',
    scope: {
      targetText: '@text'
    },
    template: '<p>{{targetText}}</p>',
    link: function($scope,el){
      el.on('click', function() {
        $log.log('targetText was clicked...');
      })

    }
  }
}]);

