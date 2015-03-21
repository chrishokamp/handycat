angular.module('directives').directive('catNav', ['Logger', 'Auth', '$location', '$rootScope', '$log',
  function(Logger, Auth, $location, $rootScope, $log) {
    return {
      restrict: 'E',
      replace: 'true',
      templateUrl: 'scripts/navigation/catNav.html',
      link: function($scope,el){
        $log.log('inside cat tool navigation directive');

        $scope.outputLog = function () {
          Logger.exportJSON();
        }

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

