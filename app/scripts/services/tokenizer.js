// TODO: tokenizers are tricky! see: https://github.com/NaturalNode/natural
// https://github.com/chrishokamp/stem
// to properly implement this, we would need a client-side model for each language
// TODO: language specific support
// WORKING:
// We want to be able to highlight ranges of tokens
// On the source side, we're totally flexible in terms of representation

'use strict';

define(['services/services'], function(services) {

  services.factory('tokenizer',['$log', function( $log ) {

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
});
