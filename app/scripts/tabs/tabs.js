angular.module('controllers').controller('TabsCtrl', ['$scope', '$location', '$anchorScroll', 'Document', '$modal', '$log',
  function($scope, $location, $anchorScroll, Document, $modal, $log) {

  $scope.tabs = [{
    title: "Translate",
    active: true,
    disabled: false
  },
  {
    title: "Statistics",
    active: false,
    disabled: false
  },
  {
    title: "Project",
    active: false,
    disabled: false

  }];

  $scope.showReplaceModal = function() {
    var modalInstance = $modal.open({
      templateUrl: 'scripts/contentArea/replace-modal.html',
      controller: 'ReplaceCtrl'
    });

    modalInstance.result.then(function () {
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });  };

  $scope.$on('perform-propagation', function(event, action) {
    $scope.$broadcast('propagate-action', action);
  });

  // Move to the bottom of the page when all the segments are complete
  $scope.scrollDone = false;
  $scope.scrollToBottom = function() {
    $location.hash('footmsg');
    $anchorScroll();
    $scope.scrollDone = true;
  };

  // Check if all the segments are marked as completed
  $scope.checkTranslationCompleted = function() {
    if (!Document.loaded)
      return false; // do not show completed before starting the job!
    for (var i = 0; i < Document.completedSegments.length; ++i)
      if (Document.completedSegments[i] == false)
        return false;
    if (!$scope.scrollDone)
      $scope.scrollToBottom();
    return true;
  };



}]);
