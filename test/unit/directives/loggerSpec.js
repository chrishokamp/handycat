
describe("Unit: Testing the logger directive", function() {
  var scope, element, logService;

  beforeEach(function(){

    module('editorComponentsApp');
    inject(function($rootScope, $compile, project) {
      scope = $rootScope.$new();
//      $log.log(scope);
      dump(scope);
      logService = project;
      element = angular.element('<div logger="test-logger" logger-event="test-event"></div>');
      // compile the element on this scope
      $compile(element)(scope);
    });
  });

  it('should log when event fires', function(done) {
    console.log('test event');
    scope.$digest();
    scope.$broadcast('test-logger');
    expect(logService['log'][0]['action']).toEqual('test-logger');
    done();
  });

});