describe("Unit: Testing the AceCtrl", function() {
  var ctrl, scope, element;

  // remember: describe() creates a suite, it() creates a spec
  // disable with xdescribe() and xit()

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
      ctrl = $controller('AceCtrl', {$scope: scope, Document:{}, tokenizer:{}, Glossary:{}, GermanStemmer:{}, Morphology: {}, ruleMap: {}, });
  //    dump(scope);
      element = angular.element('<div ui-ace="{ onLoad : aceLoaded }"></div>');
      // compile the element on this scope
      $compile(element)(scope);
    });
  });

  it('should have an instance of the Ace editor', function() {
    scope.$digest();
    expect(scope.editor).toBeDefined();
  });
  it('can set text', function() {
    var testText = "This is a test sentence";
    scope.insertText(testText);
    expect(scope.editor.getValue()).toEqual(testText);
  });

  // test actual logic!
  // EditMode tests - note that the edit mode depends upon the tokenizer function that you pass in
  // tokenEdit mode
//  it('has an edit mode which can rearrange spans', function() {
// })


});
