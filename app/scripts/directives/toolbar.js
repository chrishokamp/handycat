angular.module('directives').directive('toolbar',
  ['$log', '$timeout', '$rootScope', 'TranslationMemory', 'Glossary',
    function($log, $timeout, $rootScope, TranslationMemory, Glossary) {
  // this directive shares scope with the current active segment area
  // the toolbar communicates with the segment area to perform queries and populate new data
  return {
    restrict: 'E',
    templateUrl: 'scripts/directives/toolbar.html',
    scope: {
      activeSegment: '=',
      segments: '=',
      // this directive will provide an implementation of queryGlossary to the parent scope
      queryGlossary: '='
    },
    // try to execute this directive last, so that the parent $scope variables are initialized
    //priority: 1,
    link: function($scope, el, attrs){
     $timeout(function(){
      $scope.$watch(
        function () {
          return $scope.activeSegment;
        },
        function(index) {
          if (index === undefined) {
            index = 0;
          }
          // TODO: reinitialize all of the toolbar fields when the active segment changes
          var above = $('#segment-' + index);
          $(above).after(el);

          // make the calls for this toolbar location -- check the TM, etc...
          // TODO: this breaks on the last index
          var currentSourceText = $scope.segments[index].source;

          // TODO: query all of the user's available translation resources
          // TODO: put this logic into the segment, not inside the toolbar
          queryTM(currentSourceText);
          $scope.currentSourceText = currentSourceText;
        }
      )},1000);

//     returns: {"provider":{"name":"Lingua Custodia","id":10635},"owner":{"name":"ECB","id":10975},"source":"Based on the reference amount of 4 million euro for the period 2002-2005 and 1 million euro for 2006, the annual appropriations authorised under the Pericles programme, were Euros 1.2 million for 2002; Euros 0.9 million for 2003;","industry":{"name":"Financials","id":12},"source_lang":{"name":"English (United States)","id":"en-us"},"target":"Sur la base du montant de référence de 4 millions d ' euros pour la période 2002-2005 et d ' un million d ' euros pour 2006, les crédits annuels autorisés dans le cadre du programme Pericles étaient de 1,2 millions d ' euros pour 2002, 0,9 million d ' euros pour 2003, 0,9 million d ' euros pour 2004, 1 million d ' euros pour 2005 et 1 million d ' euros pour 2006.","content_type":{"name":"Financial Documentation","id":10},"product":{"name":"Default","id":12512},"id":"en-us_fr-fr_11128729","target_lang":{"name":"French (France)","id":"fr-fr"}}
      var queryTM = function(query) {
        var queryObj = { userId: $rootScope.currentUser._id, sourceLang: 'en-US', targetLang: 'fr-FR', query: query};
        TranslationMemory.get(queryObj, function(tmResponse) {
          $log.log('Toolbar: TM responded, result is: ');
          $log.log(tmResponse);
          // TODO: actually return a list of matches
          //$scope.tmMatches = tmResponse.segment;
          $scope.tmMatches = [tmResponse];

        });
      }


      // now we'll give the parent scope a function that other places in the app can hit
      $scope.queryGlossary = function(word, fromLang, toLang) {
        // the maximum number of results
        var maxsize = 20;
        $log.log('toolbar: querying the glossary service');

        var glossaryCallback = function (data) {
          $log.log('data is:');
          $log.log(data);
          $scope.glossaryMatches = data.map(function (item) {
            return item.text;
          });
        }
        Glossary.getMatches(word, glossaryCallback, fromLang, toLang, 20);
      };

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

