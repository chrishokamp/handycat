describe("Unit: Testing the SegmentAreaCtrl", function() {
  var ctrl, scope, element;

  beforeEach(function() {
    module('editorComponentsApp');
    inject(function($controller, $rootScope, $compile) {
      scope = $rootScope.$new();

      // create the controller with mocks for the services
      ctrl = $controller('SegmentAreaCtrl', {$scope: scope, Wikipedia:{}, Glossary:{}, ruleMap:{}, copyPunctuation:{}, Document:{}, project:{}, entityLinker: {}, entityDB: {} });
    });
  });

  it('should exist', inject(function($controller, $rootScope) {
    console.log('Testing that SegmentAreaCtrl exists...');
    expect(ctrl).toBeDefined();
  }));

  // the segment should not be on the scope yet
  it('should not have a segment on the scope yet', function() {
    expect(scope.segment).toBe(undefined);
  });

  it('should fire an event on changeSegmentState', function() {
    var eventName = 'complete';
    scope.$on('change-segment-state', function(evt, data) {
      console.log('heard change-segment-state event!');
      expect(data.newState).toEqual(eventName);
    });
    scope.changeSegmentState('complete');
  });

  
});