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

  var $scope, $compile;

  beforeEach(module('services'));
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
    this.addMatchers({
      toBeClosed: function () {
        var toolbarEl = this.actual;
        console.log(toolbarEl);
        this.message = function () {
          return 'Expected "' + angular.mock.dump(toolbarEl) + '" to be closed.';
        };
        return toolbarEl.hasClass('ng-hide') === true;

      },
      toBeOpen: function () {
        var toolbarEl = this.actual;
//        angular.mock.dump(toolbarEl);
        console.log(toolbarEl);
        this.message = function () {
          return 'Expected "' + this.actual + '" to be opened.';
        };
        return toolbarEl.hasClass('ng-hide') === false;
      }
    });
  });

//  afterEach(function () {
//    findDropDown($document.find('body')).remove();
//  });

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

    it('should not be open if the prefix matches a model', function() {

    });

  });

  // toolbar core functionality
  // should be able to transclude its widgets
  // specify widgets in markup

});