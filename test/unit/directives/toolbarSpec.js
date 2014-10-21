// TODO: switch to toolbarSpec
// model test after the ui-bootstrap tests
describe('toolbar directive tests', function () {

  var $scope, $compile;

  beforeEach(module('servers'));
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
    // set test data on the toolbar's scope
//    $scope.source = ['foo', 'bar', 'baz'];
//    $scope.states = [
//      {code: 'AL', name: 'Alaska'},
//      {code: 'CL', name: 'California'}
//    ];
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

  var findInput = function (element) {
    return element.find('input');
  };

  var findDropDown = function (element) {
    return element.find('ul.dropdown-menu');
  };

  var findMatches = function (element) {
    return findDropDown(element).find('li');
  };

  var triggerKeyDown = function (element, keyCode) {
    var inputEl = findInput(element);
    var e = $.Event('keydown');
    e.which = keyCode;
    inputEl.trigger(e);
  };

  //custom matchers
  beforeEach(function () {
    this.addMatchers({
      toBeClosed: function () {
        var typeaheadEl = findDropDown(this.actual);
        this.message = function () {
          return 'Expected "' + angular.mock.dump(typeaheadEl) + '" to be closed.';
        };
        return typeaheadEl.hasClass('ng-hide') === true;

      }, toBeOpenWithActive: function (noOfMatches, activeIdx) {

        var typeaheadEl = findDropDown(this.actual);
        var liEls = findMatches(this.actual);

        this.message = function () {
          return 'Expected "' + this.actual + '" to be opened.';
        };
        return typeaheadEl.length === 1 && typeaheadEl.hasClass('ng-hide') === false && liEls.length === noOfMatches && $(liEls[activeIdx]).hasClass('active');
      }
    });
  });

  afterEach(function () {
    findDropDown($document.find('body')).remove();
  });

  //coarse grained, "integration" tests
  describe('initial state and model changes', function () {

    it('should be closed by default', function () {
      var element = prepareInputEl('<div><input ng-model="result" typeahead="item for item in source"></div>');
      expect(element).toBeClosed();
    });

    it('should not be open if the prefix matches a model', function() {

    });

    it('should correctly render initial state if the "as" keyword is used', function () {

      $scope.result = $scope.states[0];

      var element = prepareInputEl('<div><input ng-model="result" typeahead="state as state.name for state in states"></div>');
      var inputEl = findInput(element);

      expect(inputEl.val()).toEqual('Alaska');
    });

    it('should default to bound model for initial rendering if there is not enough info to render label', function () {

      $scope.result = $scope.states[0].code;

      var element = prepareInputEl('<div><input ng-model="result" typeahead="state.code as state.name + state.code for state in states"></div>');
      var inputEl = findInput(element);

      expect(inputEl.val()).toEqual('AL');
    });

    it('should not get open on model change', function () {
      var element = prepareInputEl('<div><input ng-model="result" typeahead="item for item in source"></div>');
      $scope.$apply(function () {
        $scope.result = 'foo';
      });
      expect(element).toBeClosed();
    });
  });

});