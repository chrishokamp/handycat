// TODO: rename this controller to something better -- should be the controller for the entire page
// TODO: the catNav directive has its own controller - move navigation functions there

angular.module('controllers').controller('EditAreaCtrl', ['$scope', '$location', '$anchorScroll', 'Document', '$modal',
  '$log', 'editSession', 'loggerUrl', '$rootScope',
  function($scope, $location, $anchorScroll, Document, $modal, $log, session, loggerUrl, $rootScope) {

  // TODO: move this to a proper global controller for the edit area
  // global user options (may be accessed or changed from child controllers
  $scope.visible = {
    toolbar: false
  }

  $scope.session = session;
  $scope.url = loggerUrl;

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

  // based on http://updates.html5rocks.com/2011/08/Saving-generated-files-on-the-client-side
  // and http://stackoverflow.com/a/15031019
  $scope.saveDocument = function() {
    console.error('prueba!');
    var bb = new Blob([new XMLSerializer().serializeToString( Document.DOM )], {type: "application/xml"});
    saveAs(bb, "document.xliff");
  };

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
    if (!Document.DOM)
      return false; // do not show completed before starting the job!
    for (var i = 0; i < Document.completedSegments.length; ++i)
      if (Document.completedSegments[i] == false)
        return false;
    if (!$scope.scrollDone)
      $scope.scrollToBottom();
    return true;
  };


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

  // Shows/hides the invisible characters (space is a dot, etc)
  // Destination of a ng-click from toolbar.html
  $scope.updateShowInvisibleChars = function(value) {
    $scope.$broadcast('toggleShowInvisibleChars', value);
  };



}]);
