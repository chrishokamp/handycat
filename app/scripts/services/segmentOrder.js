// this service communicates with the service that selects the next segments to translate

angular.module('services').factory('SegmentOrder', ['$http', '$rootScope', 'baseUrl', '$log',
    function($http, $rootScope, baseUrl, $log) {

  var routePrefix = 'http://0.0.0.0:5001/reorder';

  var SegmentOrder = {
    order: [],
    getOrder: function (segments) {

      $log.log(segments);
      // if we don't have the segment order service, the order is 0, 1, 2, ...
      for (var i = 0; i < segments.length; ++i)
        this.order.push(i);

      // testing only
      //this.order = this.shuffle(this.order);
    },
    shuffle: function(o){
     for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    },
    nextSegment: function(current) {
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