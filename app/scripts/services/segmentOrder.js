// this service communicates with the service that selects the next segments to translate

angular.module('services').factory('SegmentOrder', ['$http', '$rootScope', 'baseUrl', '$log',
    function($http, $rootScope, baseUrl, $log) {

    // the query url: 'http://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srprop=snippet';
    var baseUrl = 'TODO';
    var urlPrefix = 'TODO';
    var serviceUrl = baseUrl + urlPrefix;

    var SegmentOrder = {
        order: [],
        getOrder: function (segments) {
            // if we don't have the segment order service, the order is 0, 1, 2, ...
            // TODO(ximop) develop webservice
            for (var i = 0; i < segments.length; ++i)
                this.order.push(i);
        },
        nextSegment: function(current) {
            var index = this.order.indexOf(current);
            if (index != -1)
                return this.order[index+1];
            return 0;
        }
    };

    return SegmentOrder;
}]);