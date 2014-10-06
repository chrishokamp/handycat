angular.module('directives').directive('toolbar', ['editSession', 'TranslationMemory', '$log', '$timeout', '$rootScope', function(editSession, TranslationMemory, $log, $timeout, $rootScope) {
  // this directive shares scope with the current active segment area
  // the toolbar communicates with the segment area to perform queries and populate new data
  return {
    restrict: 'E',
    templateUrl: 'scripts/directives/toolbar.html',
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
          $log.log('toolbar: ACTIVE SEGMENT CHANGED');
          $log.log(index);
          var above = $('#segment-' + index);
          $(above).after(el);
          $log.log('TOOLBAR - current $scope.activeSegment is: ' + $scope.activeSegment);
          // make the calls for this toolbar location -- check the TM, etc...
          var currentSourceText = $scope.document.segments[index].source;
          $log.log('currentSourceText: ' + currentSourceText);
          queryTM(currentSourceText);


        }
      )},0);

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

