angular.module('controllers').controller('EditAreaCtrl', ['$scope', '$location', '$anchorScroll', '$modal',
  '$log', 'SegmentOrder', 'editSession', '$rootScope', 'Wikipedia', '$timeout', 'Projects', 'XliffParser', '$stateParams', '$q',
  function($scope, $location, $anchorScroll, $modal, $log, segmentOrder, editSession, $rootScope, Wikipedia, $timeout,
           Projects, XliffParser, $stateParams, $q) {

    // global user options (may be accessed or changed from child controllers)
    $scope.visible = {
      toolbar: true,
      projectLoading: true
    };

    var docDeferred = $q.defer();
    var docPromise = docDeferred.promise;
    docPromise.then(function() {
      $log.log('Content area: then resolved');
      $scope.language = $scope.document.targetLang;
      $scope.numSegments = $scope.document.segments.length;
      $scope.segments = $scope.document.segments;
    });

    // This is the init function that sets up an edit session
    $scope.loadProject = function () {
      Projects.get({
        projectId: $stateParams.projectId
      }, function(projectResource) {
        $scope.projectResource = projectResource;
        XliffParser.parseXML(projectResource.content).then(
          function(documentObj) {
            $scope.document = documentObj;
            docDeferred.resolve();

            // The segment exchange format (in document.segments) is:
//          var segPair = { source: sourceText, target: targetText, sourceDOM: seg[0],targetDOM: seg[1]};
            $log.log('$scope.document loaded and parsed');
            $scope.visible.projectLoading = false;
          },
          function(err) {
            console.error('editArea: error initializing $scope.document');
            $scope.visible.projectLoading = false;
          }
        )
      });
    }

    // based on http://updates.html5rocks.com/2011/08/Saving-generated-files-on-the-client-side
    // and http://stackoverflow.com/a/15031019
    $scope.saveDocument = function() {
      var bb = new Blob([new XMLSerializer().serializeToString( $scope.document.DOM )], {type: "application/xml"});
      saveAs(bb, "document.xliff");
    };

    // Check if all the segments are marked as complete
    $scope.checkTranslationCompleted = function() {
      if (!$scope.document.DOM)
        return false; // do not show completed before starting the job!

      return $scope.segments.every(function(val,idx) {
        return val === 'translated';
      });
    };

    // Translate state HELP MODAL
    $scope.
      openHelp = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'scripts/editArea/help-modal.html',
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

    // this is a stub used as an interface -- a child directive may provide an implementation of queryGlossary
    // if there is no implementation, then this function does nothing
    $scope.queryGlossary = function() {}

    // this fires once the view content has completely loaded
    $rootScope.$on('repeat-finished', function (event) {
      $log.log('Heard repeat-finished');
      // quick hack -- just activate segment 0
      editSession.setSegment(0);
      // TODO: initialize the session metadata from the session metadata on the server
      // TODO: activeSegment is here so that the toolbar knows where it should go
      $scope.activeSegment = 0;

      //var segmentId = $stateParams.segmentId;
      //if (segmentId) {
      //  var anchorElem = document.getElementById('segment-' + segmentId);
      //  if (anchorElem) {
      //    var top = anchorElem.offsetTop;
      //    $("body").animate({scrollTop: top-60}, "slow");
      //  }
      //}
    });

    // listen for a segment change, and reset $scope.activeSegment accordingly
    $scope.$on('changeSegment', function(evt, data) {
      $log.log('HEARD ACTIVE SEGMENT');
      $scope.activeSegment = data.currentSegment
    })

    // if the state changes during the session without a reload
    //$rootScope.$on('$stateChangeStart',
    //  function(event, toState, toParams, fromState, fromParams){
    //    var segmentId = toParams.segmentId;
    //    if (toState.name.match(/edit\.segment/) && segmentId) {
    //      var anchorElem = document.getElementById('segment-' + segmentId);
    //      if (anchorElem) {
    //        var top = anchorElem.offsetTop;
    //        $("body").animate({scrollTop: top-60}, "slow");
    //      }
    //    }
    //  });

    // DEV UTILS
    $scope.showXLIFF = false;
    // END DEV UTILS

  }]);
