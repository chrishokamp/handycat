// the segment area is the area of the UI representing a single translation unit
// this is a source + target pair
angular.module('controllers')
.controller('SegmentAreaCtrl', [
  '$rootScope', '$scope', 'TranslationMemory', 'Wikipedia', 'Glossary', '$log', 'ruleMap', 'copyPunctuation', 'editSession',
   'Logger', 'Projects', 'XliffParser', '$http',
  function($rootScope, $scope, TranslationMemory, Wikipedia, Glossary, $log, ruleMap, copyPunctuation, Session, Logger,
           Projects, XliffParser, $http) {

    $scope.outputLog = function () {
      $log.log('SEGMENT AREA OUTPUT LOG');
      Logger.exportJSON();
    };

    // this gets reset in the template
    $scope.id = {};
    // this object holds the functions and properties that children can freely read and/or override
    $scope.shared = {
      setText: function() {$log.log('segmentArea setText fired');},
      sourceTranslations: function() {
        // when this is called from a child controller, get all of the translations for this segment
        $scope.testQuery($scope.segment.source);
      }
    }


    // WORKING
    // create buttons for the user's translation resources -- we know what resources they have from $scope.currentUser
    // buttons appear when the translation is ready, onClick the value gets put into the editor or translation component
    // response API: {provider: <provider name>, target: <target text>}
    // databind the insertText event in the editor directive

    // this obj holds the result of querying the user's various translation resources
    $scope.translationResources = [
      //{'provider': 'HandyCAT', 'target': 'test translation'}
    ];

    

    $scope.testQuery = function(sourceQuery) {
      $scope.translationsPending = true;
      var transProm = $http({
        url: 'http://localhost:5001/translate/google/de',
        method: "GET",
        params: {query: sourceQuery}
      });
      transProm.then(
        function (res) {
          $log.log('promise resolved:');
          $log.log(res);
          $scope.translationResources.push({'provider': 'HandyCAT', 'target': res.data.target})
          $scope.translationsPending = false;
        }, function (err) {
          $log.log('Error retrieving translation');
          $scope.translationsPending = false;
        }
      )
    }

    // when the translation promise resolves, add the result to the translation options, which are also rendered to the user
    // a HandyCAT resource obj has name + url -- {'name': 'google-translate', url: '/users/:userId/tm/'}
    // TODO: the url field shouldn't actually be necessary - the server looks up resources by name
    // TODO: as a proxy to named lookup, just always call the same url from client -- i.e. /users/:userId/tm/
    // the server should look up the required user credentials for the particular resource
    $scope.queryResource = function(query, resourceObj) {
      var queryObj = { userId: $scope.currentUser._id, sourceLang: 'en-US', targetLang: 'fr-FR', query: query};

      // this is the general-purpose interface to translation components and providers
      TranslationMemory.get(queryObj, function(tmResponse) {
        $log.log('SegmentControl: Translation Memory responded');
        // TODO: ensure that the TM objects conform to the HandyCAT provenance specification
        // response API: {provider: <provider name>, target: <target text>}
        $scope.translationResources.push(tmResponse);


      });
    }

  // TODO: set this only when this is actually the active scope
  $scope.isActive = { active:true };

  // TODO: segment state should be directly linked to the XLIFF document
  // TODO: currently not implemented
  // working: only one field on this object (not currentState AND completed)
  // states: [ 'pending', 'editing', 'complete' ]
  $scope.segmentState = { currentState: 'untranslated', completed: false };

  // this is the interface to segment state -- always change via this interface
  $scope.changeSegmentState = function changeSegmentState (stateName) {
    $scope.segmentState = stateName;

  }

  $scope.$on('activate-segment', function(event, index) {
    if ($scope.index === index) {
      // tell the scope to create the editor element
      $scope.$broadcast('activate');
    }
  });

  $scope.clearEditor = function() {
   $log.log('clear editor fired on the segment control');
   $scope.$broadcast('clear-editor');
  };

  // TODO: project should listen for this event, we shouldn't have a separate function to update the project
  $scope.segmentFinished = function(segId) {
    $log.log("SEGMENT FINISHED - segId is: " + segId);
    $scope.segmentState.completed = true;
    $scope.isActive.active = false;

    // TODO: call a function on the document API - document API should all be in EditAreaCtrl
    // TODO: this is not the right interface -- completedSegments should not be stored outside of the XLIFF DOM
    // -- big question: should we maintain a javascript document model, or only use the XLIFF DOM
    $scope.document.completedSegments[segId] = true;

    // TODO: the rest of this function should be on the EditAreaCtrl
    // pass in the current segment as the argument -- let the segmentOrder service do the logic to determine what the next segment should be
    // - this line is CRITICAL - tells the UI to move to the next segment
    $log.log('$scope.index: ' + $scope.index);
    Session.focusNextSegment($scope.index);

    // Update the current segment in the XLIFF DOM
    // Note: the application critically relies on the targetDOM being a link into the DOM object of the XLIFF
    // Right now, we depend on $scope.segment.targetDOM.textContent and $scope.segment.target being manually synced
    $scope.segment.targetDOM.textContent = $scope.segment.target;
    $scope.document.revision++;

    // Update the project on the server
    $scope.projectResource.content = XliffParser.getDOMString($scope.document.DOM);
    $scope.projectResource.$update(function() {
      $log.log('Project updated');
    });

  };

  // Re-opens a finished segment. Undoes what segmentFinished() did
  // TODO: this should be handled within the element itself -- there should be a single interface to segmentState
  $scope.reopen = function(idx) {
    $scope.segmentState.completed = false;
    Session.setSegment(idx);
    $scope.isActive.active = true;
  };

  // when the changeSegment event fires, each AceCtrl scope responds
  // TODO: this event overlaps with change-segment-state
  // the change segment event is fired from changeSegment in the editSession service
  // TODO: move this code to EditAreaCtrl
  $scope.$on('changeSegment', function(e,data) {
    if (data.currentSegment === $scope.index) {
      // tell the staticTarget directive to create the editor element
      $scope.$broadcast('activate');
      // smooth scroll
      var top = document.getElementById('segment-' + $scope.index).offsetTop;
      // scroll and add space for the navbar
      var navBarHeight = 100;
      $("body").animate({scrollTop: top - navBarHeight}, "slow");
    }
  });

}]);
