angular.module('services').factory('Morphology', [ '$log', function($log) {

  // Cache of words requested in the current session.
  // Prevents multiple calls to the server for the same word.
  // TODO(xpl) cache
  // var wordCache = {};

  return {
    // Given a word, returns the word with the number changes if possible.
    // changeNumber('dog', 'en', 'I have two dog') -> 'dogs'
    // changeNumber('dogs', 'en', 'I have one dogs') -> 'dog'
    changeNumber: function (word, lang, context) {
      $log.log('changeNumber call: ' + word + ' ' + lang);
      if (!lang)
        lang = 'en';
      if (!context)
        context = '';

      // TODO(ximop) call the webservice
      if (word.slice(-1) == 's')
        return word.slice(0, -1);
      else
        return word + 's';
    },

    // Change the gender of a word
    changeGender: function(word, lang, context) {
      $log.log('changeGender call: ' + word + ' ' + lang);
      // TODO(ximop) call the webservice
      return word;
    }
  };

}]);