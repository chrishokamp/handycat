// create a project from some raw text
// assume that each line is a new source segment
// user needs to select the source and target languages

// (1) node XLIFF creator (with browserify)
// (2) user uploads text
// (3) parse and create XLIFF

describe("createProject tests", function () {
  var ctrl, scope;
  // inject the module containing the stuff we want to test
  beforeEach(module('services'));
  beforeEach(module('controllers'));
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    // create the controller with mocks for all of the services it requires
    ctrl = $controller('', {$scope: scope});
    // optionally create and compile an element if it's necessary for this test (i.e. if the controller works together with a directive)
    // element = angular.element('<div></div>');
    // $compile(element)(scope);
  }));

  it('should ', inject(function ($controller, $rootScope) {
    // expect(scope.prop).toBe(ans);
  }));

});
