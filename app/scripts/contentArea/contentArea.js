// Holds all of the translation pairs and handles the interface with the Document service
angular.module('controllers').controller('ContentAreaCtrl',
    ['$scope', 'Document', 'project', '$location', '$anchorScroll', '$state', '$modal', '$log',
    function($scope, Document, project, $location, $anchorScroll, $state, $modal, $log) {
  if (Document.segments.length === 0) {
    $state.go('project');
  }
  $scope.numSegments = Document.segments.length;
  // each segment is a reference to the segment in the Document service
  $scope.segments = Document.segments;

  // watch the flag on the Documents service
  $scope.$watch(function() {
      return Document.revision;
    },
    function() {
      $log.log("ContentAreaCtrl: Number of segments in document: " + Document.segments.length);

      // segments is a list of [source, target] pairs
      $scope.segments = Document.segments;

      // dev mode only
      if (Document.loaded) {
        $scope.xliff_content = new XMLSerializer().serializeToString( Document.DOM );
      }
    }
  );

  // WORKING - show a modal with the help
  $scope.items = ['item1', 'item2', 'item3'];

  $scope.openHelp = function (size) {

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

  // TODO: focus the edit area -- edit areas call the translation memory onFocus
  // start by focusing project.currentSegment

}]);
