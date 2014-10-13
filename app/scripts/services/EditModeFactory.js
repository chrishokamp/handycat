// an edit mode factory provides the machinery to create new edit modes
// an edit mode provides an alternative tokenization methodology
// swapping and moving tokens has different meaning for different EditModes
// in general, we want to delegate swap/move to the current edit mode selected by the user
// the default mode can be a no-op, or something similar
// the edit mode should have no dependencies upon the ui -- unless it uses
// Ace - convert string indices to Range -- does this function exist?
//    answer -- no, the component needs to provide its mapping of the string indices to a range
//           -- this is easy when we use wrap mode, because the editor only has one row
// map over token indices, consider new lines to be just another token


angular.module('services')
.factory('EditModeFactory', [function() {

    var EditMode = function(spanTokenizer, spanDetokenizer) {
      var self = this;
      self.tokenRanges = [];

      self.setText = function(text) {
        self.setSpans(text)
      }

      self.setSpans = function(text) {
        var tokenPromise = spanTokenizer(text);
        // Careful -- side effect!
        tokenPromise.then(
          function(tokenList) {
            self.tokenRanges = _.map(tokenList, function(obj) {
              // currently we don't allow multiple rows, and we wrap the text, so the row is always = 0
              return [obj.start, obj.end, obj.token];
            });
          },
          function(err) {
            $log.log("EditModeFactory - ERROR: there was an error getting the token ranges");
          }
        );
      };

      self.swapTokens = function(idx1, idx2) {
        var tok1 = self.tokenRanges[idx1];
        var tok2 = self.tokenRanges[idx2];
        self.tokenRanges[idx2] = tok1;
        self.tokenRanges[idx1] = tok2;
      }

      // this function uses the spanDetokenizer to render tokens back into strings
      self.renderCurrentTokens = function() {
        return spanDetokenizer(self.tokenRanges.map(function (r) {return r[2]}));
      }

      //

    }

    return {
      getInstance: function(spanTokenizer, spanDetokenizer) {
        return new EditMode(spanTokenizer, spanDetokenizer);
      }
    }
}]);
