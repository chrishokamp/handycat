describe('Unit: test the SegmentOrder service', function () {

  var SegmentOrder, $q, $rootScope, testSegments;

  beforeEach(module('services'));
  beforeEach(inject(function(_SegmentOrder_, _$q_, _$rootScope_) {
    SegmentOrder = _SegmentOrder_;
    $q = _$q_;
    $rootScope = _$rootScope_;

    // create a set of segments
    testSegments = [
      {state: 'translated'},
      {state: 'translated'},
      {state: 'translated'}
    ]
  }));

  describe('Basic SegmentOrder functionality', function() {
    it('correctly finds the next segment', function() {
      expect(SegmentOrder).toBeDefined();
    });

    it('returns -1 if all segments are in the translated state', function() {
      expect(SegmentOrder.nextSegment(1, testSegments)).toEqual(-1);
    });

  });
});
