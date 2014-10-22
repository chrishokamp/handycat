angular.module('directives').directive('toolbar', ['$log', '$timeout', '$rootScope', function($log, $timeout, $rootScope) {
  // this directive shares scope with the current active segment area
  // the toolbar communicates with the segment area to perform queries and populate new data
  return {
    restrict: 'E',
    templateUrl: 'scripts/directives/toolbar.html',
    scope: {
      activeSegment: '=',
      segments: '='
    },
    // try to execute this directive last, so that the parent $scope variables are initialized
    priority: 1,
    link: function($scope, el, attrs){
     $timeout(function(){
       // TODO: assign the model to watch in the markup (don't hard-code $scope.activeSegment)
      $scope.$watch(
        function () {
          return $scope.activeSegment;
        },
        function(index) {
          if (index === undefined) {
            index = 0;
          }
          // TODO: reinitialize all of the toolbar fields when the active segment changes
          $log.log('toolbar: ACTIVE SEGMENT CHANGED');
          $log.log(index);
          var above = $('#segment-' + index);
          $(above).after(el);
          $log.log('TOOLBAR - current $scope.activeSegment is: ' + $scope.activeSegment);
          // make the calls for this toolbar location -- check the TM, etc...
          // TODO: this breaks on the last index
          var currentSourceText = $scope.segments[index].source;
          $log.log('currentSourceText: ' + currentSourceText);

//          queryTM(currentSourceText);
          $scope.currentSourceText = currentSourceText;
        }
      )},0);

//      {"provider":{"name":"Lingua Custodia","id":10635},"owner":{"name":"ECB","id":10975},"source":"Based on the reference amount of 4 million euro for the period 2002-2005 and 1 million euro for 2006, the annual appropriations authorised under the Pericles programme, were Euros 1.2 million for 2002; Euros 0.9 million for 2003;","industry":{"name":"Financials","id":12},"source_lang":{"name":"English (United States)","id":"en-us"},"target":"Sur la base du montant de référence de 4 millions d ' euros pour la période 2002-2005 et d ' un million d ' euros pour 2006, les crédits annuels autorisés dans le cadre du programme Pericles étaient de 1,2 millions d ' euros pour 2002, 0,9 million d ' euros pour 2003, 0,9 million d ' euros pour 2004, 1 million d ' euros pour 2005 et 1 million d ' euros pour 2006.","content_type":{"name":"Financial Documentation","id":10},"product":{"name":"Default","id":12512},"id":"en-us_fr-fr_11128729","target_lang":{"name":"French (France)","id":"fr-fr"}}
      var queryTM = function(query) {
        var queryObj = { userId: $scope.currentUser._id, sourceLang: 'en-US', targetLang: 'fr-FR', query: query};
        TranslationMemory.get(queryObj, function(tmResponse) {
          $log.log('Toolbar: TM responded, result is: ');
          $log.log(tmResponse);
          $scope.tmMatches = tmResponse.segment;

        });
      }

      // Events for interacting with the toolbar
      $scope.$on('update-glossary-area', function(evt, data) {
        $log.log('toolbar: update-glossary-area');
        $log.log(data);

        $scope.glossaryMatches = data.map(function(item) {
          return item.text;
        });
      })

      // TODO: when would the TM be updated by an action outside of the TM component?
      $scope.$on('update-tm-area', function(evt, data) {
        $log.log('toolbar: update-tm-area');
        $log.log(data);

        // TODO: datastructure for TM matches -- isomorphic to TBX specification
//        $scope.tmMatches = data.map(function(item) {
//          return item.text;
//        });
        $scope.tmMatches = data
      })
    }
  }
}]);

