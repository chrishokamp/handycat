// a directive adding a special chars component
// use & to call a function with the special chars
// require ngModel, and use it to init the special chars for the component
'use strict';
define(['../directives/directives'], function(directives){
  directives.directive('chars', function($log) {
    return {
      restrict: 'A',
      replace: 'true',
      scope: {
        special: '=',
        // pass the function used by the controller in the view
        selected: '&',
        show: '@'
      },
      templateUrl: 'scripts/directives/special-chars.html',

      link: function(scope,el){
        // bind the events on the special char buttons
        $log.log("scope.special is: " + scope.special);
      }
    };
  });
});