// tests for the AceCtrl which require some functional services
describe("Midway: AceCtrl", function() {
  var tester;
  var rootScope;

  beforeEach(function(){
    if(tester) {
      tester.destroy();
    }
    tester = ngMidwayTester('services')
  });

  it('should have a service called tokenizer',
    function(done) {
      var tokenizer = tester.inject('tokenizer');
      expect(tokenizer).not.toBe(null)
      expect(tokenizer.tokenize).not.toBe(null)
    }
  );
//  // test that Activities refresh works correctly
//  it('should refresh Activities and Updates on the refresh-activities event',
//    function(done) {
//      var Activities = tester.inject('Activities');
//      rootScope = tester.inject('$rootScope');
//
//      // $broadcast the refresh event
//      rootScope.$broadcast('refresh-activities');
//      console.log('broadcasting refresh-activities');
//
//      expect(Activities).not.toBe(null)
//      expect(Activities.events).not.toBe(null)
//
//    }
//  );

});
