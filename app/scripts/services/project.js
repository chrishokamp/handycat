// Holds the project-wide settings, like source and target languages,  and editing stats
// TODO: add editing stats
// TODO: throw errors when we ask for segments that don't exist

angular.module('services').factory('project', ['$rootScope', 'SegmentOrder', 'Document',
    function($rootScope, SegmentOrder, Document) {

    return {
      // set to true to show a textarea with the modifications of the XLIFF in real time.
      debugXLIFF: false,

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
        $rootScope.$broadcast('changeSegment', {currentSegment: self.activeSegment});
        return this.activeSegment;
      }
    }
}]);
