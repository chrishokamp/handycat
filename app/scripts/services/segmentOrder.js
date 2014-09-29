// this service communicates with the service that selects the next segments to translate

angular.module('services').factory('SegmentOrder', ['$http', '$rootScope', 'baseUrl', '$log',
    function($http, $rootScope, baseUrl, $log) {

  var routePrefix = 'http://0.0.0.0:5001/reorder';

  var SegmentOrder = {
    order: [],
    initSegmentOrder: function (segments) {
      $log.log('Initializing SegmentOrder - here are segments: ');
      $log.log(segments);

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