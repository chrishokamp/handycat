// TODO: see the build your own angular directive tests

describe('typeaheadEditor directive tests: ', function () {

  var $scope, $rootScope, $compile;

  beforeEach(module('handycatConfig'));
  beforeEach(module('scripts/typeahead/typeahead.html'));
  beforeEach(module('handycat.typeaheads'));
  beforeEach(function() {

  });

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
    $compile = _$compile_;
  }));

  //utility functions
  var prepareInputEl = function (inputTpl) {
    var el = $compile(angular.element(inputTpl))($scope);
    document.body.appendChild(el[0]);
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
  // TODO: check if the typeahead area is opened or closed
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

  describe('typeahead component tests', function () {

    it('should render its databound value', function () {
      $scope.startValue = "This is a prefix";
      $scope.sourceSegment = 'Dies ist ein Prefix.';
      $scope.targetLang = 'en';
      $scope.sourceLang = 'de';
      var element = prepareInputEl('<typeahead-editor target-segment="startValue" source-segment="sourceSegment" source-lang="{{sourceLang}}" target-lang="{{targetLang}}"></typeahead-editor>');

      var $isolateScope = element.isolateScope();
      expect($isolateScope.targetSegment).toEqual($scope.startValue);
      expect($isolateScope.targetLang).toEqual($scope.targetLang);
      expect($isolateScope.sourceLang).toEqual($scope.sourceLang);
      expect(element.find('textarea').val()).toEqual($scope.startValue);

      // test 2-way databinding
      $scope.startValue = "This is a new prefix";
      $scope.$digest();
      expect(element.isolateScope().targetSegment).toEqual($scope.startValue);
    });

  });

  xdescribe('linking with parent scope', function () {

    it('should keep track of the active segment property of its parent', function() {
      $scope = $rootScope.$new();
      var element = prepareInputEl('<toolbar active-segment="1" segments="" source-lang="en" target-lang="de" query-glossary="queryGlossary" class="info-toolbar" ng-show="visible.toolbar"></toolbar>');

      $rootScope.activeSegment = 1;
      $rootScope.$digest();

      var isolateScope = element.isolateScope();
      expect(isolateScope.activeSegment).toEqual(1);
      expect(isolateScope.segments).toBeUndefined();
    });

    it('should keep track of the array of segment objects on the parent scope', function() {
      $scope = $rootScope.$new();
      var element = prepareInputEl('<toolbar active-segment="activeSegment" segments="document.segments" source-lang="en" target-lang="de" query-glossary="queryGlossary" class="info-toolbar" ng-show="visible.toolbar"></toolbar>');
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

});
