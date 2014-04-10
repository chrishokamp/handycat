angular.module('services')
  .factory('copyPunctuation', ['$log', function($rootScope, $log) {

  return {
    copySourcePunctuation: function(source, target) {
      // TODO(ximop) Create a server for this feature
      if (source && target) {
        // get source punctuation
        var sourcePunct = source.trim().slice(-1);
        // if it's punctuation
        var currentTargetPunct = target.trim().slice(-1);
        if (sourcePunct !== currentTargetPunct && sourcePunct.match(/[\.!;\?]/))
            target += sourcePunct;
      }
      return target;
    }
  };
}]);