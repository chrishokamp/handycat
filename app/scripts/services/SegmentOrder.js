// this service communicates with the service that selects the next segments to translate
// by default, segments are in their original order, but an ordering function can be specified in the configuration

angular.module('services').factory('SegmentOrder', ['$http', '$rootScope', 'baseUrl', '$log',
    function($http, $rootScope, baseUrl, $log) {

  var SegmentOrder = {
    // WORKING - get the lowest segment which is not yet translated - depends on the segment model
    nextSegment: function(current, allSegments) {
      $log.log('nextSegment - current: ' + current);
      var index = this.order.indexOf(current);
      if (index != -1) {
        if (index+1 == this.order.length)
          return -1;
        return this.order[index + 1];
      }
      return 0;
    }
  };

    return SegmentOrder;
}]);
