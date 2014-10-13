
describe("Unit: Testing the logger directive", function() {
  var scope, element, logService;

  beforeEach(module('services'));
  beforeEach(module('editorComponentsApp'));

//  beforeEach(inject(function(session){
//    logService = session;
//  }));
  beforeEach(function(){
    inject(function($rootScope, $compile, $injector) {
      logService = $injector.get('editSession');
      scope = $rootScope.$new();
      element = angular.element('<div logger="test-logger" logger-event="test-event"></div>');
      // compile the element on this scope
      $compile(element)(scope);
    });
  });

  it('should log when event fires', function() {
    inject(function($timeout) {
    console.log('test event');
    scope.$digest();
    scope.$broadcast('test-logger');
    // TODO: try spying on the function
    //http://tobyho.com/2011/12/15/jasmine-spy-cheatsheet/

//    $timeout(function() {
//      console.log(logService['log']);
//      expect(logService['log'][0]['action']).toEqual('test-logger');
////    expect(true).toEqual(true);
////    done();
//    },0);
    });
  });

});