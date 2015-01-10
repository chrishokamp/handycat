// this service implements choosing the next segment for editing
// by default, segments are in their original order, but an ordering function can be specified in the configuration

angular.module('services').factory('SegmentOrder', [
  function() {

    var SegmentOrder = {
      nextSegment: function(current, allSegments) {
        var segIdxs = _.range(allSegments.length);
        // get the lowest indexed segment which is not yet translated - depends on the segment model
        // returning -1 means that there are no segments available for translation
        var pending = segIdxs.filter(function(val,idx) {
          return allSegments[val].state !== 'translated';
        });

        if (pending.length > 0) {
          return pending[0];
        }
        return -1;
      }
    };
    return SegmentOrder;
  }]);
