describe("Unit: Testing the AceCtrl", function() {
  var ctrl, scope, element, selectRangeInEditor, Range, $timeout;

  // remember: describe() creates a suite, it() creates a spec
  // disable with xdescribe() and xit()

  // issues:
  // ace requires ui.ace, which is required by the editorComponentsApp module
  // if we require editorComponentsApp, then we need to mock the call to /auth/session, because authentication gets set up in app.js

  beforeEach(function() {
    module('ui.ace');
    module('services');
    module('controllers');
    inject(function($controller, $rootScope, $compile, _$timeout_, $httpBackend) {
      $httpBackend.when('GET', '/auth/session').respond({'currentUser': 'testUser'});
      $timeout = _$timeout_;
      scope = $rootScope.$new();
      // the AceCtrl watches this property
      scope.isActive = {
        active: true
      };

      // mock the 'segment' property on the parent scope (simulates SegmentAreaCtrl)
      var segment = { source: "test sentence", target: "Testsatz"};
      // mocks of properties/functions on parent controller (SegmentCtrl)
      scope.segment = segment;

      // now create the controller with mocks for the services
      ctrl = $controller('AceCtrl', {$scope: scope, Document:{}, tokenizer:{}, Glossary:{}, ruleMap: {}, session: {}, autocompleters: {autocompleters: []}, editSession: {} });

      // TODO: move this to a 'prepareElement() function which is called inside each spec
      element = angular.element('<div ui-ace="{ onLoad : aceLoaded }" ng-model="testModel"></div>');

      // compile the element on this scope
      $compile(element)(scope);
    });
  });

  beforeEach(function() {
    Range = ace.require('ace/range').Range;
    selectRangeInEditor = function (aceRange) {
      scope.editor.getSelection().setSelectionRange(aceRange);
    };
  });

  // insert text via user input or functions on the AceCtrl
  describe('basic editor functionalities', function() {
    //beforeEach(function() {
    //  scope.$digest();
    //});

    it('should have an instance of the Ace editor', function() {
      expect(scope.editor).toBeDefined();
    });

    it('can set text', function() {
      var testText = "This is a test sentence";
      scope.setText(testText);
      expect(scope.editor.getValue()).toEqual(testText);
    });

    it('should be able to retrieve the current selection', function() {
      var testText = "This is a test sentence";
      scope.setText(testText);

      var testRange = new Range(0,0, 0,3);
      selectRangeInEditor(testRange);
      var actualRange = scope.editor.getSelectionRange();

      expect(actualRange).toEqual(testRange);
      expect(actualRange).not.toEqual(new Range(1,3,4,5));
      // get the text at the current range
      expect(scope.editor.session.getTextRange(actualRange)).toEqual('Thi');
    });

    // test $scope.replaceText
    // it('can replace the current selection with a new selection')
  });


  // Working: get the current prefix of the editor
  var util = ace.require("./autocomplete/util");
  describe('maintaining the current prefix', function() {
    it('maintains the correct prefix', function() {
      var testText = "This is a test sentence";
      scope.setText(testText);
      var editor = scope.editor;
      // move the cursor
      var session = editor.getSession();

      var pos = editor.getCursorPosition();
      var line = session.getLine(pos.row);
      var prefix = util.retrievePrecedingIdentifier(line, pos.column);
      expect(prefix).toEqual('sentence');

      scope.editor.getSelection().moveCursorBy(0, -5);
      pos = editor.getCursorPosition();
      line = session.getLine(pos.row);
      var prefix = util.retrievePrecedingIdentifier(line, pos.column);

      expect(prefix).toEqual('sen');

      scope.editor.getSelection().moveCursorBy(0, -7);
      pos = editor.getCursorPosition();
      line = session.getLine(pos.row);
      var prefix = util.retrievePrecedingIdentifier(line, pos.column);

      expect(prefix).toEqual('t');

    });

    it('returns the right value from $scope.currentWordPrefix', function() {
      // empty, add text, delete text
      var testText = "This is a test sentence";
      scope.insertText(testText);
      var editor = scope.editor;
      var session = editor.getSession();

      var prefix = scope.currentWordPrefix();
      expect(prefix).toBe('sentence');


      // move the cursor
      scope.editor.getSelection().moveCursorBy(0, -7);
      var pos = editor.getCursorPosition();
      var line = session.getLine(pos.row);
      var prefix = util.retrievePrecedingIdentifier(line, pos.column);
      expect(prefix).toBe('s');
    });

    it('can add text at the current cursor location', function() {
      var testText = "This is a test sentence";
      scope.insertText(testText);
      var editor = scope.editor;

      var prefix = scope.currentWordPrefix();
      expect(prefix).toBe('sentence');

      var pos = editor.getCursorPosition();
      expect(pos['column']).toEqual(testText.length);

      var testText2 = "test two";
      scope.insertText(testText2);
      var prefix = scope.currentWordPrefix();
      expect(prefix).toBe('two');
      var pos = editor.getCursorPosition();
      expect(pos['column']).toEqual(testText.length + testText2.length);

    });

    it('deletes text the prefix text when overwritePrefix is called', function() {
//      var prefix = util.retrievePrecedingIdentifier(line, pos.column);
      // TODO: how does the ace editor overwrite the autocomplete prefix?
      // TODO: what happens on select in the ace autocomplete?
      // keyboard doesn't work with ace autocomplete (only supports mouse selection)
      var startingText = "This is a test sentence";
      scope.insertText(startingText);
      var prefix = scope.currentWordPrefix();
      expect(prefix).toBe('sentence');

      // empty, add text, delete text
      var newText = 'rabid dog';
      scope.overwritePrefix(newText);
      var prefix = scope.currentWordPrefix();
      expect(prefix).toBe('dog');

      var currentValue = scope.getValue();
      expect(currentValue).toEqual('This is a test rabid dog')
//      // TODO: how does the ace editor overwrite the autocomplete prefix?
//      // TODO: what happens on select in the ace autocomplete?
    });

  });

});
