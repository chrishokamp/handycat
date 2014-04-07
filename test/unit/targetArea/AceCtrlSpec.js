describe("Unit: Testing the AceCtrl", function() {
  var ctrl, scope, element;

  beforeEach(function() {
    module('editorComponentsApp');
    inject(function($controller, $rootScope, $compile) {
      scope = $rootScope.$new();
      // mock the 'segment' property on the parent scope (simulates SegmentAreaCtrl)
      var segment = { source: "test sentence", target: "Testsatz"};
      // mocks of properties/functions on parent controller
      scope.segment = segment;
      scope.setSource = function(test) {};

      // now create the controller with mocks for the services
      ctrl = $controller('AceCtrl', {$scope: scope, Document:{}, TranslationMemory:{}, tokenizer:{}, Glossary:{}, GermanStemmer:{} });
  //    dump(scope);
      element = angular.element('<div ui-ace="{ onLoad : aceLoaded }"></div>');
      // compile the element on this scope
      $compile(element)(scope);
  });
  });

  it('should exist', inject(function($controller, $rootScope) {
    expect(ctrl).toBeDefined();
  }));

  it('should have an instance of the Ace editor', function() {
    scope.$digest();
    expect(scope.editor).toBeDefined();
  });
});