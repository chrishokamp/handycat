describe('Unit: test the EditModeFactory', function () {

  var EditModeFactory, $q, $rootScope;

  // Load your module.
  beforeEach(module('services'));
  beforeEach(inject(function(_EditModeFactory_, _$q_, _$rootScope_) {
    EditModeFactory = _EditModeFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  // utils
  var charTokenizer = function(text) {
    var defer = $q.defer();
    var chars = text.split('');
  // currentValue, idx, array

    var tokens = chars.map(function(char, idx, array) {
      return {"start": idx, "end": idx+1, "token": char}
    });

    defer.resolve(tokens);
    return defer.promise;
  }

  var charDetokenizer = function(tokenStrings) {
    // currentValue, idx, array
    return tokenStrings.join('');

  };

  describe('Core EditModeFactory Functionalities', function() {
    it('can get an instance of the factory', function() {
      expect(EditModeFactory).toBeDefined();
    });

    it('can be initialized with some value', function() {
      var testSen = 'Some content';
      var CharEditMode = EditModeFactory.getInstance(charTokenizer);
      CharEditMode.setText(testSen);

      expect(CharEditMode.tokenRanges.length).not.toBeGreaterThan(0);
      $rootScope.$digest();
      expect(CharEditMode.tokenRanges.length).toBeGreaterThan(0);
    });
    it('can tokenize its content using a tokenization function', function() {
      var testSen = 'Some content';
      var CharEditMode = EditModeFactory.getInstance(charTokenizer);
      CharEditMode.setSpans(testSen);

      $rootScope.$digest();
      expect(CharEditMode.tokenRanges.length).toEqual(12);
      expect(CharEditMode.tokenRanges.length).not.toEqual(13);
    });
    it('can map its tokens back into strings', function() {
      var testSen = 'Some content';
      var CharEditMode = EditModeFactory.getInstance(charTokenizer, charDetokenizer);
      CharEditMode.setSpans(testSen);

      $rootScope.$digest();
      expect(CharEditMode.renderCurrentTokens()).toEqual(testSen);
    });
    it('can swap tokens', function() {
      var testSen = 'Some content';
      var CharEditMode = EditModeFactory.getInstance(charTokenizer, charDetokenizer);
      CharEditMode.setSpans(testSen);

      $rootScope.$digest();
      CharEditMode.swapTokens(0,1);
      expect(CharEditMode.renderCurrentTokens()).toEqual('oSme content');
    });
    it('knows which token index an integer index is inside', function() {
      var testSen = 'Some content';
      var CharEditMode = EditModeFactory.getInstance(charTokenizer, charDetokenizer);
      CharEditMode.setSpans(testSen);

      $rootScope.$digest();
      var tokenIdx = CharEditMode.tokenAtIdx(5);
      expect(tokenIdx).toEqual(5);
    });
    it('can return the string representation of a token', function() {
      var testSen = 'Some content';
      var CharEditMode = EditModeFactory.getInstance(charTokenizer, charDetokenizer);
      CharEditMode.setSpans(testSen);

      $rootScope.$digest();
      var tokenString = CharEditMode.idxToString(5);
      expect(tokenString).toEqual('c');

    });
  });
});

