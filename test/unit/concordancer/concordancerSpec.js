describe('concordancer service specs', function () {
  // Load your module.
  beforeEach(module('myFactoryMod'));

  // Setup the mock service in an anonymous module.
  beforeEach(module(function ($provide) {
    $provide.value('oneOfMyOtherServicesStub', {
        someVariable: 1
    });
  }));

  it('can get an instance of my factory', inject(function(myFactory) {
    expect(myFactory).toBeDefined();
  }));
});
