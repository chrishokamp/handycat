// TODO: switch to toolbarSpec
// model test after the ui-bootstrap tests

// External things that the toolbar relies on:
// Services: 'editSession', 'TranslationMemory', '$log', '$timeout', '$rootScope'
// parent $scope variables:
// $scope.activeSegment
// $scope.document.segments[index].source;
// $scope.currentSourceText

// Internal variables it updates:
//  $scope.tmMatches
//    $scope.glossaryMatches

// Events:  $scope.$on('update-tm-area', function(evt, data) {


describe('toolbar directive tests', function () {

  var $scope, $rootScope, $compile;

  beforeEach(module('services'));
  beforeEach(module('directives'));
  beforeEach(module('scripts/directives/toolbar.html'));
  // TODO: switch path reference using http when
  beforeEach(module(function($compileProvider) {
    // TODO: Working: only necessary when directive relies on ngModel
    $compileProvider.directive('formatter', function () {
      return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ngModelCtrl) {
          ngModelCtrl.$formatters.unshift(function (viewVal) {
            return 'formatted' + viewVal;
          });
        }
      };
    });
  }));
  beforeEach(inject(function (_$rootScope_, _$compile_, _$document_, _$timeout_, $sniffer) {
    $scope = _$rootScope_;
    $rootScope = _$rootScope_;
    // set test data on the toolbar's scope
//    $scope.source = ['foo', 'bar', 'baz'];
    $compile = _$compile_;
    $document = _$document_;
    $timeout = _$timeout_;

  }));

  //utility functions
  var prepareInputEl = function (inputTpl) {
    var el = $compile(angular.element(inputTpl))($scope);
    $scope.$digest();
    return el;
  };

  var triggerKeyDown = function (element, keyCode) {
    var inputEl = findInput(element);
    var e = $.Event('keydown');
    e.which = keyCode;
    inputEl.trigger(e);
  };

  //custom matchers
  beforeEach(function () {
    jasmine.addMatchers({
      toBeClosed: function () {
        return {
          compare: function(actual, expected) {
            return {
              pass: actual.hasClass('ng-hide') === true
            }
          }
        }
      },
      toBeOpen: function () {
        return {
          compare: function(actual, expected) {
            return {
              pass: actual.hasClass('ng-hide') === false
            }
          }
        }
      }
    });
  });

  afterEach(function () {
    $rootScope.$destroy();
    $scope.$destroy();
  });


  //coarse grained, "integration" tests
  describe('initial state and model changes', function () {

    it('should be closed by default', function () {
      var element = prepareInputEl('<toolbar class="info-toolbar" ng-show="visible.toolbar"></toolbar>');
      expect(element).toBeClosed();
    });

    it('should open when it is supposed to', function () {
      var element = prepareInputEl('<toolbar class="info-toolbar" ng-show="visible.toolbar"></toolbar>');
      $scope.visible = { 'toolbar': true };
      $scope.$digest();
      expect(element).toBeOpen();
    });

  });

  describe('linking with parent scope', function () {

    it('should keep track of the active segment property of its parent', function() {
      $scope = $rootScope.$new();
      var element = prepareInputEl('<toolbar class="info-toolbar" active-segment="activeSegment" ng-show="visible.toolbar"></toolbar>');

      $rootScope.activeSegment = 1;
      $rootScope.$digest();

      var isolateScope = element.isolateScope();
      expect(isolateScope.activeSegment).toEqual(1);
      expect(isolateScope.segments).toBeUndefined();
    });

    it('should keep track of the array of segment objects on the parent scope', function() {
      $scope = $rootScope.$new();
      var element = prepareInputEl('<toolbar class="info-toolbar" active-segment="activeSegment" segments="document.segments" ng-show="visible.toolbar"></toolbar>');
      var testSegment = { source: 'a source sentence', target: 'a target sentence', sourceDOM: 'DOMstub',targetDOM: 'DOMstub'};

      $rootScope.document = { segments: [testSegment]};
      $rootScope.activeSegment = 0;
      $rootScope.$digest();

      var isolateScope = element.isolateScope();
      expect(isolateScope.segments[isolateScope.activeSegment]).toEqual(testSegment);

      $rootScope.activeSegment = 1;
      $rootScope.$digest();
      expect(isolateScope.segments[isolateScope.activeSegment]).toBeUndefined();
    });

  });




  // toolbar core functionality
  // should be able to transclude its widgets
  // specify widgets in markup

});
