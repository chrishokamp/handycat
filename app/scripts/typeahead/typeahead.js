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
          $log.log('targetSegment: ' + $scope.targetSegment);
          if ($scope.targetSegment === undefined) {
            $scope.targetSegment = '';
          }
          $http.get(lmAutocompleterURL,
            {
              params: {
                target_prefix: $scope.targetSegment,
                source_segment: $scope.sourceSegment,
                target_lang: $scope.targetLang,
                source_lang: $scope.sourceLang
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
              }).filter(function(item) {
                // filter completions to be at least 2 chars lon
                if (item.length >= 2) {
                  return true;
                }
                return false;
              });
              cachedResponse = completions;
              callback(completions);
            });
        }

        var dummyFilter = function(query, data, searchKey) {
          return []
        }

        // controllers are named by their 'at' trigger (whatever string it is)
        // Override the default 'filter' and 'remoteFilter' functions
        $inputTextarea.data('atwho').controllers[""].setting.callbacks.filter = dummyFilter;
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
