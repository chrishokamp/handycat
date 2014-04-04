// Call webservice to change the number of a word
// Example: house -> houses

angular.module('services').factory('WordNumber', [ '$log', function($log) {

  // Cache or words requested in the current session.
  // Prevents multiple calls to the server for the same word.
  var wordCache = {};


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
    }
  };

}]);