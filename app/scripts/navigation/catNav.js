angular.module('directives').directive('catNav', ['Logger', 'Auth', '$location', '$rootScope', '$log', 'hotkeys',
  function(Logger, Auth, $location, $rootScope, $log, hotkeys) {
    return {
      restrict: 'E',
      replace: 'true',
      templateUrl: 'scripts/navigation/catNav.html',
      link: function($scope,el){
        $log.log('inside cat tool navigation directive');

        $scope.$watch(function() {
          return $rootScope.projectResource;
        }, function(projectResource) {
          if (projectResource) {
            $scope.projectName = projectResource.name;
          }
        });

        $scope.outputLog = function () {
          Logger.exportJSON();
        }

        $scope.showCheatSheet = function() {
          hotkeys.toggleCheatSheet();
        }

        // TODO: move this to the grid bottom sheet in editArea
        $scope.saveJSON = function() {
          $log.log("saving JSON");
          $log.log(Logger.exportJSON());
          var blob = new Blob([Logger.exportJSON()], {type: "application/json"});
          // saveAs is provided in the global scope by file-saver
          saveAs(blob, "edit-log.json");
        };

        $scope.logout = function() {
          Auth.logout(function(err) {
            if(!err) {
              $location.path('/login');
            }
          });
        };

      }
    }
  }]);

