angular.module('concordancer', ['handycatConfig']);

angular.module('concordancer')
.factory('concordancer', ['concordancerURL', 'levenshtalignerURL', '$http', function(concordancerURL, levenshtalignerURL, $http) {
    return {
      getConcordances: function(query, lang) {
        return $http.get(concordancerURL,
        {
          params: {
            query: query,
            lang: lang
          }
        });
      },

      getLevenshtalignment: function(str1, str2) {
        return $http.get(levenshtalignerURL,
          {
            params: {
              str1: str1,
              str2: str2
            }
          });
      }

    };
}]);

