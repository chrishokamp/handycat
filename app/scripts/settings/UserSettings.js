angular.module('controllers')
.controller('UserSettingsCtrl', ['$scope', 'User', '$log', function($scope, User, $log) {

    // Working -- make sure the user is loaded on the $scope
    // the user resource should already be globally loaded on the rootscope
    $scope.alerts = [];

    $scope.addAlert = function(type, message) {
      $scope.alerts.push({type: type, msg: message});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };


//      $scope.loadProject = function () {
//    Projects.get({
//      projectId: $stateParams.projectId
//    }, function(projectResource) {
//      // WORKING - parse the project's XLIFF, and set up the API to its DOM
//      $log.log('This states projectResource is: ');
//      $log.log(projectResource);
//      $scope.projectResource = projectResource;
//      $scope.document = XliffParser.parseXML(projectResource.content);
//      // initialize the SegmentOrder service
//      segmentOrder.initSegmentOrder($scope.document.segments);
//      $log.log('$scope.document loaded and parsed');
//
//    })

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

    // test call to tausdata (test that credentials are valid)
  // Update the project on the server

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

