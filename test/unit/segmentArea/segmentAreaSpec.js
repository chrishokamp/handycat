describe("Unit: Testing the SegmentAreaCtrl", function() {
  var ctrl, scope, element, TranslationMemory;

  beforeEach(function() {
    module('editorComponentsApp');
    inject(function($controller, $rootScope, $compile, _TranslationMemory_) {
      scope = $rootScope.$new();

      TranslationMemory = _TranslationMemory_;
      console.log('TranslationMemory');
      console.log(TranslationMemory);

      // create the controller with mocks for the services
      //ctrl = $controller('SegmentAreaCtrl', {$scope: scope, TranslationMemory: TranslationMemory, Wikipedia:{}, Glossary:{}, ruleMap:{}, copyPunctuation:{}, Session:{}, Logger: {}, Projects: {}, XliffParser: {} });
      ctrl = $controller('SegmentAreaCtrl', {$scope: scope, TranslationMemory: TranslationMemory});
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

  describe('handling input from translation resources', function () {
    beforeEach(function() {
      var segment = { source: "test sentence", target: "Testsatz"};
      // mocks of properties/functions on parent controller
      scope.segment = segment;

      var currentUser = {
        _id: 'chris-test-id',
        translationResources: [
          {'name': 'google-translate', url: '/users/:userId/tm/'}
        ]
      }
      scope.currentUser = currentUser;
      spyOn(TranslationMemory, 'get');

    });

    it('should be able to retrieve a translation for the current source segment', function() {
      console.log('scope.segment');
      console.log(scope.segment);
      // get the source segment
      console.log('SEGMENT SOURCE:');
      console.log(scope.segment.source);

      // where does the $scope look for the User's translation resources?
      //  - answer: on the $rootScope's currentUser.translationResources

      // query the resource obj, get back a promise, add the promise data to the rendered resource responses
      var sourceSegment = scope.segment;
      scope.queryResource(sourceSegment);
      expect(TranslationMemory.get).toHaveBeenCalled();

      // TODO: implement this API
      //var testResource = scope.currentUser.translationResources[0];
      // current queryObj format:
      //var queryObj = { userId: scope.currentUser._id, sourceLang: 'en-US', targetLang: 'fr-FR', query: query};
      //scope.queryResource(testResource, sourceSegment);

    });

    it('should have a shared object containing functions that children can override', function() {
      // create a child controller with scope.new(), and hit the functions in $scope.shared
      scope.shared.setText();
      var childScope = scope.$new();
      var setText = function() {
        childScope.testText = 'test';
      }
      expect(childScope.testText).toBeUndefined();
      childScope.setText = setText;
      scope.shared.setText = setText;

      // call the function on the parent controller
      scope.shared.setText();
      expect(childScope.testText).toEqual('test');
    })

  });



});
