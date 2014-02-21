describe("Unit: Testing the AceCtrl", function() {
  var ctrl, scope;
  beforeEach(module('editorComponentsApp'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    // now create the controller
    ctrl = $controller('AceCtrl', {$scope: scope});
    dump(scope);
  }));

  it('should exist', inject(function($controller, $rootScope) {
    expect(ctrl).toBeDefined();
  }));
  it('should have a germanChars property', inject(function($controller, $rootScope) {
    expect(scope.germanChars.length).toBe(7);
  }));
});
