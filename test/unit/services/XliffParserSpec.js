describe('XliffParser', function () {

  // TODO: implement the XLIFF 2.0 test suite on the parser (also the ITS test suite(?))
  // See here for the tests:

  // TODO: Remember that the XliffParser returns a Document object (internal application representation)

  var XliffParser, sampleXliff, $q, $rootScope, $timeout;

  // Load your module.
  beforeEach(module('services'));
  beforeEach(inject(function(_XliffParser_, _$q_, _$rootScope_, _$timeout_) {
    XliffParser = _XliffParser_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));
  beforeEach(function() {
    sampleXliff = '<?xml version="1.0" encoding="utf-8" standalone="yes"?>' +
    '<xliff version="1.0">' +
       '<file source-language="en" target-language="de" datatype="plaintext" original="messages" date="2011-08-25T17:54:43Z" product-name="your-ext">' +
          '<header/>' +
          '<body>' +
             '<trans-unit id="pi1_title" approved="yes" xml:space="preserve">' +
                '<source>My extension</source>   ' +
                '<target>Meine Erweiterung</target>' +
             '</trans-unit>' +
             '<trans-unit id="pi1_plus_wiz_description" approved="yes" xml:space="preserve">' +
                '<source>Adds a list of stuff to the page.</source>' +
                '<target>Fügt eine Liste von Dinge.</target>' +
             '</trans-unit>' +
          '</body>' +
       '</file>' +
    '</xliff>';
  });
  beforeEach(function() {
    spyOn(XliffParser, "readFile").and.callThrough();
    spyOn(XliffParser, "loadLocalFile").and.callThrough();
    spyOn(XliffParser, "parseXML").and.callThrough();

  });


  describe('Parser Setup', function () {

    it('can get an instance', function() {
      expect(XliffParser).toBeDefined();
    });

    it('can call a method', function() {
      XliffParser.parseXML(sampleXliff);
      expect(XliffParser.parseXML).toHaveBeenCalled();
    });

  });

  describe('XliffParser exposed functions', function (done) {

    it('can read a file with the fileReader service', function(done) {
      var parsedXliff;

      XliffParser.parseXML(sampleXliff).then(
        function(res) {
          console.log('INSIDE XliffParser callback');
          parsedXliff = res;
          expect(XliffParser.getDOMString(res.DOM)).toEqual(sampleXliff);
        }
      ).finally(done);

      expect(undefined).toEqual(parsedXliff);
      $timeout.flush();
    });

  });

});
