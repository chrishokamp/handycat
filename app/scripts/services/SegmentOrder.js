// this service implements choosing the next segment for editing
// by default, segments are in their original order, but an ordering function can be specified in the configuration

angular.module('services').factory('SegmentOrder', ['$http', '$rootScope', 'baseUrl', '$log',
  function($http, $rootScope, baseUrl, $log) {

    // returning -1 means that there are no segments available for translation
    var SegmentOrder = {
      nextSegment: function(current, allSegments) {
        $log.log('nextSegment - current: ' + current);
        var segIdxs = _.range(allSegments.length);
      // WORKING - get the lowest indexed segment which is not yet translated - depends on the segment model
        var pending = segIdxs.filter(function(val,idx) {
          return allSegments[val].state !== 'translated';
        });

        if (pending.length > 0) {
          $log.log('returning: ' + pending[0]);
          return pending[0];
        }
        $log.log('returning: ' + pending[0]);
        return -1;
      }
    };

    return SegmentOrder;
  }]);
