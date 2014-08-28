angular.module('directives').directive('catNav', ['Logger', 'Document', '$rootScope', '$log', function(Logger, Document, $rootScope, $log) {
  return {
    restrict: 'E',
    replace: 'true',
//    templateUrl: 'catNav.html',
    templateUrl: 'scripts/navigation/catNav.html',
    link: function($scope,el){
      $log.log('inside cat tool navigation directive');

      $scope.outputLog = function () {
        Logger.exportJSON();
      }

      // based on http://updates.html5rocks.com/2011/08/Saving-generated-files-on-the-client-side
      // and http://stackoverflow.com/a/15031019
      $scope.saveXLIFF = function() {
        var bb = new Blob([new XMLSerializer().serializeToString( Document.DOM )], {type: "application/xml"});
        saveAs(bb, "document.xliff");
      };
      $scope.saveJSON = function() {
        $log.log("saving JSON");
        $log.log(Logger.exportJSON());
        var bb = new Blob([Logger.exportJSON()], {type: "application/json"});
        saveAs(bb, "edit-log.json");
      };

      // TODO: switch to toggle on-off
      $scope.toggleToolbar = function () {
        $log.log('TOGGLE TOOLBAR');
        $rootScope.$broadcast('show-toolbar');

      }
    }
  }
}]);

