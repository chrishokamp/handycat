describe('XliffTwoParser', function () {

  // TODO: implement the XLIFF 2.0 test suite on the parser (also the ITS test suite(?))
  // TODO: Remember that the XliffTwoParser returns a Document object (internal application representation)

  var XliffTwoParser, sampleXliff, $q, $rootScope, $timeout;

  // Load your module.
  beforeEach(module('services'));
  beforeEach(inject(function(_XliffTwoParser_, _$q_, _$rootScope_, _$timeout_) {
    XliffTwoParser = _XliffTwoParser_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));
  beforeEach(function() {
    sampleXliff =
       '<?xml version="1.0" encoding="utf-8"?>' +
       '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="en" trgLang="de">' +
        '<file id="f1">' +
          '<unit id="u0">' +
            '<segment>' +
              '<source>This is sentence one.</source>' +
              '<target/>' +
            '</segment>' +
          '</unit>' +
          '<unit id="u1">' +
           '<segment>' +
             '<source>This is sentence two.</source>' +
             '<target/>' +
           '</segment>' +
          '</unit>' +
        '</file>' +
       '</xliff>';
  });
  beforeEach(function() {
    spyOn(XliffTwoParser, "readFile").and.callThrough();
    spyOn(XliffTwoParser, "loadLocalFile").and.callThrough();
    spyOn(XliffTwoParser, "parseXML").and.callThrough();

  });


  describe('Parser Setup', function () {

    it('can get an instance', function() {
      expect(XliffTwoParser).toBeDefined();
    });

    it('can call a method', function() {
      XliffTwoParser.parseXML(sampleXliff);
      expect(XliffTwoParser.parseXML).toHaveBeenCalled();
    });

  });

  describe('XliffTwoParser exposed functions', function (done) {

    it('can read a file with the fileReader service', function(done) {
      var parsedXliff;

      XliffTwoParser.parseXML(sampleXliff).then(
        function(res) {
          console.log('INSIDE XliffTwoParser callback');
          parsedXliff = res.DOM;
          expect(XliffTwoParser.getDOMString(parsedXliff)).toEqual(sampleXliff);
        }
      ).finally(done);

      expect(undefined).toEqual(parsedXliff);
      $timeout.flush();
    });

  });

  // Integration test (testing downstream usage)
  describe('Writing into nodes of the Xliff DOM should also change the text nodes', function (done) {

    it('should create text nodes properly', function(done) {
      var parsedObject;
      var s1 = 'My extension';

      XliffTwoParser.parseXML(sampleXliff).then(
        function(res) {
          console.log('INSIDE XliffTwoParser callback');
          parsedObject = res;
          expect(parsedObject.segments[0].sourceDOM.textContent).toEqual(s1);
        }
      ).finally(done);

      expect(undefined).toEqual(parsedObject);
      $timeout.flush();

    });


    it('should maintain changes', function(done) {
      var parsedObject;
      var t1 = 'Meine Erweiterung';
      var t2 = 'Mein Hund';

      XliffTwoParser.parseXML(sampleXliff).then(
        function(res) {
          console.log('INSIDE XliffTwoParser callback');
          parsedObject = res;
          expect(parsedObject.segments[0].targetDOM.textContent).toEqual(t1);
          parsedObject.segments[0].targetDOM.textContent = t2;
          var nodeString = XliffTwoParser.getDOMString(parsedObject.segments[0].targetDOM);
          expect(nodeString).toEqual('<target>' + t2 + '</target>');

        }
      ).finally(done);

      expect(undefined).toEqual(parsedObject);
      $timeout.flush();

    });
  });

});
