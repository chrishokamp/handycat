describe("Unit: Testing the AceCtrl", function() {
  var ctrl, scope, element;

  beforeEach(function() {
    module('editorComponentsApp');
    inject(function($controller, $rootScope, $compile) {
      scope = $rootScope.$new();
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
//  it('should have a germanChars property', inject(function($controller, $rootScope) {
//    expect(scope.germanChars.length).toBe(7);
//  }));
  it('should have a germanChars property', function() {
    expect(scope.germanChars.length).toBe(7);
  });
  it('should have an instance of the Ace editor', function() {
    scope.$digest();
    // mock the ace editor object
    // editor =
    //scope.aceLoaded(editor);

    expect(scope.editor).toBeDefined();
  });
});
