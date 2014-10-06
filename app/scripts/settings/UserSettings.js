angular.module('controllers')
.controller('UserSettingsCtrl', ['$scope', 'User', 'TranslationMemory', '$log', function($scope, User, TranslationMemory, $log) {

    // Working -- make sure the user is loaded on the $scope
    // the user resource should already be globally loaded on the rootscope
    $scope.alerts = [];

    $scope.addAlert = function(type, message) {
      $scope.alerts.push({type: type, msg: message});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.updateUserTausCredentials = function() {
      $log.log('TausUsername: ' + $scope.TausUsername);
      $log.log('TausPassword: ' + $scope.TausPassword);
      $log.log('currentUser:');
      $log.log($scope.currentUser);
//      Auth.setTMCredentials($scope.TausUsername, $scope.TausPassword);
      $scope.currentUser.tausUsername = $scope.TausUsername;
      $scope.currentUser.tausPassword = $scope.TausPassword;

      $scope.currentUser.$update(function() {
        // TODO: show alert
        $log.log('current user updated');
        $scope.addAlert('success', 'TAUS credentials updated!')
      })
    }

    // TODO: test call to tausdata (test that credentials are valid)
    $scope.testTM = function() {
      // call the TAUS TM from the server, and ask for a segment
      // https://www.tausdata.org/api/segment.json?source_lang=en-US&target_lang=fr-FR&q=data+center
      // Update the project on the server
      $log.log('Testing TM - userId is: ' + $scope.currentUser._id);
      var queryObj = { userId: $scope.currentUser._id, sourceLang: 'en-US', targetLang: 'fr-FR', query: 'swimming pool'};
      $log.log('Translation Memory');
      $log.log(TranslationMemory);
      TranslationMemory.get(queryObj, function(tmResponse) {
        $log.log('TM responded, result is: ');
        $log.log(tmResponse);

      });
    }

    // TODO - where can we see the current user resource? - is it on $rootScope?
//    $scope.projectResource.content = XliffParser.getDOMString($scope.document.DOM);
//    $scope.projectResource.$update(function() {
//      $log.log('Project updated');
//    });


    $scope.$watch(
      function() {
        return $scope.TausUsername
      },
      function() {
        $log.log('TausUsername: ' + $scope.TausUsername);
      }
    )

}]);

