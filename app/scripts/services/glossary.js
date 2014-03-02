// Working - provide the ectaco dictionary from this service
angular.module('services').factory('Glossary', [ '$http', '$log', function($http,$log) {
  // load the file from data/
//  var glossaryFile = 'data/ectaco-en-pos-de.tsv';

  //development
  var glossaryFile = 'data/glossary.small.tsv';

  // allWords for autocomplete
  var allWords = [];
  // en --> de index for queries
  $http.get(glossaryFile)
    .success(function(data) {
      var lines = data.match(/[^\r\n]+/g);
      var dictionary = _.map(lines, function(line) {
        var units = line.split('\t');
        var translations = units[2].split(', ');
        return {source: units[0], pos: units[1], targets: translations};
      });
      // now add every target word to the autocomplete
      _.each(dictionary, function(unit){
        _.each(unit.targets, function(targetWord) {
          allWords.push(targetWord);
        });
      });

      $log.log("dictionary object");
      $log.log(dictionary);
      $log.log("allWords");
      $log.log(allWords);

    })
  return {
    allWords: allWords
  }

}]);
