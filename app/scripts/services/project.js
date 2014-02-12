'use strict';

// Holds the project-wide settings, like source and target languages,  and editing stats
// TODO: add editing stats
// TODO: throw errors when we ask for segments that don't exist

define(['services/services'], function(services) {

  services.factory('project', ['$rootScope', function($rootScope) {

    return {
      activeSegment: 0,
      nextSegment: function() {
        return this.activeSegment + 1;
      },
      setSegment: function(segIndex) {
        var self = this;
        self.activeSegment = segIndex;
        $rootScope.$broadcast('changeSegment', {currentSegment: self.activeSegment});
        return this.activeSegment;
      }
    }
  }]);
});