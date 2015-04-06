angular.module('handycat.typeaheads', []);

// an input area with one or more typeahead datasets enabled

angular.module('handycat.typeaheads')
  .directive('typeaheadEditor', ['$log', '$http', function($log, $http) {
    return {
      scope: {
        'targetSegment': '=',
        'sourceSegment': '=',
        'targetLang': '@',
        'sourceLang': '@'

      },
      templateUrl: 'scripts/typeahead/typeahead.html',
      link: function($scope, el, attrs) {
        var $inputTextarea = el.find('.atwho-input');

        $inputTextarea.atwho({
          at: '',
          suffix: ' '
        })

        var cachedResponse = [];
        var remoteFilter = function(query, callback) {
          // hack - if the query is not empty (if this is not a space character), return the cached response
          if (query !== '') {
            callback(cachedResponse);
            return
          }

          var testSourceSegment = "Dies ist falsch.";
          $log.log('remoteFilter');
          $log.log('targetText: ' + $scope.targetText);
          $http.get(lmAutocompleterURL,
            {
              params: {
                target_prefix: $scope.targetSegment,
                source_segment: $scope.sourceSegment,
                // TODO: add correct langs
                target_lang: '',
                source_lang: ''
              }
            }
          )
          .success(
            function (completionData) {
              $log.log('completionData');
              $log.log(completionData);
              var completions = completionData['ranked_completions'].map(function(i) {
                // return only the completion, not the score
                return i[0];
              });
              cachedResponse = completions;
              callback(completions);
            });
        }

        var testFilter = function(query, data, searchKey) {
          return []
        }

        // controllers are named by their 'at' trigger (whatever string it is)
        // Override the default 'filter' and 'remoteFilter' functions
        $inputTextarea.data('atwho').controllers[""].setting.callbacks.filter = testFilter;
        $inputTextarea.data('atwho').controllers[""].setting.callbacks.remoteFilter = remoteFilter;

        // you can add multiple triggers
        //  .atwho({
        //  at: ":",
        //  data: ["+1", "-1", "smile"]
        //});
      }
    }
}])
  //.controller('typeaheadCtrl', function() {
// TODO: normalize punctuation here
  //});
