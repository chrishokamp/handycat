
describe("Unit: Testing the logger directive", function() {
  var scope, element, logService;

  beforeEach(function(){
    module('editorComponentsApp');
    inject(function($rootScope, $compile, $injector) {
      scope = $rootScope.$new();
//      $log.log(scope);
      dump(scope);
      // TODO: why can't we inject SegmentOrder?
      logService = $injector.get('project');

      element = angular.element('<div logger="test-logger" logger-event="test-event"></div>');
      // compile the element on this scope
      $compile(element)(scope);
    });
  });

  it('should log when event fires', function() {
    console.log('test event');
    scope.$digest();
    scope.$broadcast('test-event');
    dump(logService['log']);
    expect(logService['log'][0]['action']).toEqual('test-event');
//    expect(project.log[0]['action']).toEqual('balls-event');

  });

});