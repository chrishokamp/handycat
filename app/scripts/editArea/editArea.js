angular.module('controllers').controller('EditAreaCtrl', ['$scope', '$location', '$anchorScroll', '$modal',
  '$log', 'SegmentOrder', '$rootScope', 'Wikipedia', '$timeout', 'Projects', 'XliffParser', '$stateParams',
  function($scope, $location, $anchorScroll, $modal, $log, segmentOrder, $rootScope, Wikipedia, $timeout,
           Projects, XliffParser, $stateParams) {

  // global user options (may be accessed or changed from child controllers)
  $scope.visible = {
    toolbar: false,
    projectLoading: true
  };

  // TODO: resolve the projectResource and the parsed document object before this state loads
  // This is the init function that sets up an edit session
  $scope.loadProject = function () {
    Projects.get({
      projectId: $stateParams.projectId
    }, function(projectResource) {
      $scope.projectResource = projectResource;
      XliffParser.parseXML(projectResource.content).then(
        function(documentObj) {
          $scope.document = documentObj;

          // The segment exchange format (in document.segments) is:
//          var segPair = { source: sourceText, target: targetText, sourceDOM: seg[0],targetDOM: seg[1]};
          $log.log('$scope.document loaded and parsed');

          // TODO: there is a long pause here, find out why
          $timeout(
            function() {
              $scope.visible.projectLoading = false;
            },
            500);
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

    // HELP MODAL
    $scope.
      openHelp = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'scripts/contentArea/help-modal.html',
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

    // used as a callback for the glossary
    var updateGlossaryArea = function(glossaryMatches) {
      if (glossaryMatches) {
        // the toolbar should be listening for this
        $rootScope.$broadcast('update-glossary-area', glossaryMatches);
      }
    };

    $scope.queryGlossary = function(query, fromLang, toLang) {
      Glossary.getMatches(query, updateGlossaryArea, fromLang, toLang);
      Session.updateStat('queryGlossary', $scope.$index, query);
    };

    // Working - use a callback here just like with the glossary
    // Working - remove the event listener here - give it to the toolbar
    // Concordance
    $scope.queryConcordancer = function(query, lang) {
      if (!lang)
        lang = $scope.document.sourceLang;
      $scope.concordancerError = false;
      //Session.updateStat('queryConcordancer', $scope.$index, query);
      Wikipedia.getConcordances(query, lang);
    };

    $scope.$on('concordancer-updated', function() {
      // does $scope.$apply happen automagically? - answer: no, so we have to listen for the event
      $scope.concordanceMatches = Wikipedia.currentQuery;
    });

    $scope.$on('concordancer-error', function() {
      $scope.concordancerError = true;
    });
  }]);
