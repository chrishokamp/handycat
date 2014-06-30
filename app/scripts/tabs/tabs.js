angular.module('controllers').controller('TabsCtrl', ['$scope', '$location', '$anchorScroll', 'Document', '$modal',
  '$log', 'project', 'session', 'loggerUrl',
  function($scope, $location, $anchorScroll, Document, $modal, $log, Project, session, loggerUrl) {

  $scope.session = session;
  $scope.url = loggerUrl;

  $scope.toggleSmartButtons = function() {
    Project.showSmartButtons = !Project.showSmartButtons;
  };


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


  // WORKING - show a modal with the help
  $scope.items = ['item1', 'item2', 'item3'];

  $scope.
    openHelp = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'scripts/contentArea/help-modal.html',
//      template: '<div>TEST MODAL</div>',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.
  var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };


}]);
