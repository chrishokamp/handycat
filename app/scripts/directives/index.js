angular.module('directives').directive('index', ['$log', function($log) {
  return {
    // use the index attr
    //scope: {
    //  index: '@'
    //},
    restrict: 'A',
    link: function(scope,el,attrs){
      attrs.$observe('index', function(val) {
        $log.log("inside index directive, value is: " + val);
        // cast to Number because all attrs are strings
        scope.index = Number(val);
      })
    }
  };
}]);
