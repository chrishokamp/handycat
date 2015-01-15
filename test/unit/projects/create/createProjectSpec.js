// create a project from some raw text
// assume that each line is a new source segment
// user needs to select the source and target languages

// (1) node XLIFF creator (with browserify)
// (2) user uploads text
// (3) parse and create XLIFF

describe("createProject tests", function () {
  var ctrl, scope;
  // inject the module containing the stuff we want to test
  // TODO: how to handle the dependency on ui-router - this controller causes state changes!
  beforeEach(module('ngMaterial'));
  beforeEach(module('controllers'));
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    // create the controller with mocks for all of the non-core services that it requires
    ctrl = $controller('CreateProjectCtrl', {$scope: scope, $state: {}, XliffParser: {}, Projects: {}});
  }));

  it('should be able to  ', inject(function ($controller, $rootScope) {
    // expect(scope.prop).toBe(ans);
  }));

});
