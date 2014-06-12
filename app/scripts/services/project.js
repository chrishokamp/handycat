// Holds the project-wide settings, like source and target languages,  and editing stats
// TODO: add editing stats
// TODO: throw errors when we ask for segments that don't exist

angular.module('services').factory('project', ['$rootScope', 'SegmentOrder', 'Document', '$log','$rootScope',
    function($rootScope, SegmentOrder, Document, $log) {

    return {
      // set to true to show a textarea with the modifications of the XLIFF in real time.
      debugXLIFF: false,

      // order of segments
      activeSegment: 0,
      setActiveSegment: function(segId) {
          this.activeSegment = segId;
      },
      getNextSegment: function() {
        if (SegmentOrder.order.length == 0)
            SegmentOrder.getOrder(Document.segments);
        return SegmentOrder.nextSegment(this.activeSegment);
      },
      focusNextSegment: function() {
        var self = this;
        var next = self.getNextSegment();
        self.setSegment(next);
      },
      setSegment: function(segIndex) {
        var self = this;
        self.activeSegment = segIndex;
        if (segIndex != -1)
          $rootScope.$broadcast('changeSegment', {currentSegment: self.activeSegment});
        return this.activeSegment;
      },

      // stats
      // stores all the actions performed by the user in order
      log:[],

      updateStat: function(stat, segment, data) {
        $log.log('update stat');
        var date = new Date().getTime();
        var self = this;
        self.log.push({
          'action': stat,
          'segmentId': segment,
          'data': data,
          'time': date
        });
        console.log(self.log);
      }
    }
}]);
