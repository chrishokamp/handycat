// TODO: tokenizers are tricky! see: https://github.com/NaturalNode/natural
// https://github.com/chrishokamp/stem
// to properly implement this, we would need a client-side model for each language
// TODO: language specific support
// WORKING:
// We want to be able to highlight ranges of tokens
// On the source side, we're totally flexible in terms of representation

angular.module('services').factory('tokenizer',['$log', function( $log ) {

  // Naive tokenization for a line of text -- note: for TMs, leaving punctuation is actually ok
  var tokenize = function(str) {
    // Note: this regex replaces, it doesn't just split
//      var words = str.replace(/[^a-zA-Z0-9\u00C0-\u00FF]+/g, ' ').split(' '),
//	     lang = lang || 'en';

    // this one just splits on whitespace
    var words = str.replace(/\s+/g, ' ').split(' '),
      lang = lang || 'en';
    return words;
  }

  // WORKING - add server-backed tokenization for the various edit modes
  // - one route for each language and tokenization type (token, phrase, etc...)
  // - function convertIndexToRange()
  // - don't allow multiple lines in the editor (override the function of 'Return')
  // - servers return a list of pairs (start, end), for the token type
  // - tokens cannot overlap

  // map tokens (strings) to (start, end) pairs
  function tokensToSpans(tokenList, completeString) {
    var startPos = 0,
      currentString = completeString,
      tokenSpans = [];

    tokenSpans = _.map(tokenList, function(token) {
      var match = currentString.match(token);
      if (match) {
        var startIndex = match.index + startPos;
        var endIndex = startIndex + token.length;
        currentString = completeString.slice(endIndex);
        startPos = endIndex;

        return { "token": token, "start": startIndex, "end": endIndex };
      }
    })
    var filtered = _.filter(tokenSpans, function(s) { return (s !== undefined); });
    return filtered;
  }
//  var testRes = tokensToSpans(['this', 'is', 'a', 'test'], "This is a test.");
//  $log.log('tokensToSpans results: ');
//  $log.log(testRes);

  return {
    tokenize: function(str) {
      return tokenize(str);
    },
    subphrases: function(tokens,minLen) {
      // phrases: [[]], toks: []
      var phrases = [];
      var toks = [];

      if (typeof tokens === 'string') {
        toks = this.tokenize(toks);
      } else if (tokens instanceof Array) {
        toks = tokens;
      }
      // iterate over each beginning token
      _.each(_.range(toks.length), function(tok, begin) {
        // push all of the ngrams beginning with this token
        _.each(_.range(begin+minLen, toks.length+1), function(end) {
          // slice at the indices
          phrases.push(toks.slice(begin,end));
        });
      });
      return phrases;
    }
  }
}]);
