describe('concordancer service specs', function () {

  var $httpBackend, concordancerBackendHandler, $q;

  beforeEach(module('config', function ($provide) {
    // mock the config concordancerURL and levenshtalignerURL
    $provide.constant('concordancerURL', 'http://concordancer');
    $provide.constant('levenshtalignerURL', 'http://levenshtalign')
  }));
  beforeEach(module('concordancer'));

  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    $q = $injector.get('$q');
    var promise = $q.defer().promise;

    // backend definition common for all tests - not currently used
    //concordancerBackendHandler = $httpBackend.when('GET', '/concordancer')
    //  .respond(promise);

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('can get an instance of the concordancer service', inject(function(concordancer) {
    expect(concordancer).toBeDefined();
  }));

  it('has a function called getConcordances with params :lang and :query', inject(function(concordancer) {
    spyOn(concordancer, 'getConcordances');
    var q = 'this is a test.';
    var lang = 'en';
    var prom = concordancer.getConcordances(q, lang)

    expect(concordancer.getConcordances).toHaveBeenCalledWith(q, lang);
  }));

  it('has a function called getLevenshtalignment with params str1 and str2', inject(function(concordancer) {
    spyOn(concordancer, 'getLevenshtalignment');

    var s1 = 'this is a test.';
    var s2 = 'this is another test.';
    var prom = concordancer.getLevenshtalignment(s1, s2)

    expect(concordancer.getLevenshtalignment).toHaveBeenCalledWith(s1, s2);
  }));
});
