describe("Unit: Testing the SegmentAreaCtrl", function() {
  var ctrl, scope, element;

  beforeEach(function() {
    module('editorComponentsApp');
    inject(function($controller, $rootScope, $compile) {
      scope = $rootScope.$new();

      // create the controller with mocks for the services
      ctrl = $controller('SegmentAreaCtrl', {$scope: scope, Wikipedia:{}, Glossary:{}, GermanStemmer:{}, ruleMap:{}, copyPunctuation:{}, Morphology: {}, Document:{}, project:{} });
    });
  });

  it('should exist', inject(function($controller, $rootScope) {
    expect(ctrl).toBeDefined();
  }));

  // the segment should not be on the scope yet
  it('should not have a segment on the scope yet', function() {
    expect(scope.segement).toBe(undefined);
  });
});