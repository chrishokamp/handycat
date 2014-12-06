// the segment area is the area of the UI representing a single translation unit
// this is a source + target pair
angular.module('controllers')
.controller('SegmentAreaCtrl', [
  '$rootScope', '$scope', 'TranslationMemory', 'Wikipedia', 'Glossary', '$log', 'ruleMap', 'copyPunctuation', 'editSession',
   'Logger', 'Projects', 'XliffParser', '$http',
  function($rootScope, $scope, TranslationMemory, Wikipedia, Glossary, $log, ruleMap, copyPunctuation, Session, Logger,
           Projects, XliffParser, $http) {

    // TODO: testing only

    // working - utils for autocompletion
    // TODO: use the autocompleters service to resolve the autocompleters for the user
    // GET /autocompleters --
    // params that let us know what autocompleters the user has:
    // source lang
    // target lang
    // domain
    // TODO: there should be a selection dialog where the user can choose which autocompleters they want to use
    // a user's autocompleters grow over time
    // as they select segments, we log: { source: source-text, target_prefix: target-text, completion: <selected unit from autocomplete> }

    $scope.sampleOptions = [
      {'segment': 'Schließen Sie alle laufenden Programme, und starten Sie den Computer neu .',
        'created': 'August 26, 1984',
        'quality': 0.95,
        'provider': 'Google Translate'
      },
      {'segment': 'es-zh-test',
        'created': 'Novemeber 15, 2013',
        'projectState': 'completed',
        'quality': 0.2,
        'projectCreator': 'Chris Hokamp'
      },
      {'segment': 'million dollar translation project',
        'created': 'January 26, 2014',
        'quality': 0.3,
        'projectState': 'pending',
        'projectCreator': 'Chris Hokamp'
      },
      {'segment': 'es-zh-test',
        'created': 'Novemeber 15, 2013',
        'quality': 0.5,
        'projectState': 'completed',
        'projectCreator': 'Chris Hokamp'
      },
      {'segment': 'million dollar translation project',
        'created': 'January 26, 2014',
        'quality': 0.9,
        'projectState': 'pending',
        'projectCreator': 'Chris Hokamp'
      },
      {'segment': 'es-zh-test',
        'created': 'Novemeber 15, 2013',
        'quality': 0.9,
        'projectState': 'completed',
        'projectCreator': 'Chris Hokamp'
      },
      {'segment': 'million dollar translation project',
        'created': 'January 26, 2014',
        'quality': 0.9,
        'projectState': 'pending',
        'projectCreator': 'Chris Hokamp'
      },
      {'segment': 'million dollar translation project',
        'created': 'January 26, 2014',
        'quality': 0.9,
        'projectCreator': 'Chris Hokamp'
      }
    ];
    $scope.clickTest = function() {
      $log.log('CLICKITY');
      $log.log('showTranslations:');
      $scope.showTranslations = !$scope.showTranslations;
      $log.log($scope.showTranslations);
    }
    // TODO: End testing only

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


    // WORKING
    // create buttons for the user's translation resources -- we know what resources they have from $scope.currentUser
    // buttons appear when the translation is ready, onClick the value gets put into the editor or translation component
    // response API: {provider: <provider name>, target: <target text>}
    // databind the insertText event in the editor directive
    // this obj holds the result of querying the user's various translation resources
    $scope.translationResources = [
      //{'provider': 'HandyCAT', 'target': 'test translation'}
      {'provider': 'HandyCAT', 'target': 'test translation'}
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
        })
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

  // this is called when the user clicks anywhere in the segment area
  $scope.activate = function($index) {
    $log.log('activate: ' + $index);
    $scope.reopen($index);
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
    // ----> answer: we cannot use the XLIFF dom directly because angular doesn't let us use DOM nodes as models
    $scope.document.completedSegments[segId] = true;

    // TODO: the rest of this function should be on the EditAreaCtrl
    // pass in the current segment as the argument -- let the segmentOrder service do the logic to determine what the next segment should be
    // - this line is CRITICAL - tells the UI to move to the next segment
    $log.log('$scope.index: ' + $scope.index);
    // TODO: the logic of focusing the next segment is broken -- it causes the user to jump around
    // TODO: how to keep the editing flow smooth, even when the user jumps out of order?
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

    // update the user's translation resources (update the TM)
    // what is the data model for a TM object { sourceLang: <sourceLang>, targetLang: <targetLang>, source: <source>, target: <target>, createdBy: <creator>, date: <date> }
    // a new TM object is (at least) two nodes, the source segment and the target segment, both containing fields for creator, date created
    var graphTMUrl = 'http://localhost:8899/tm';
    $log.log('Scope document');
    $log.log($scope.document);
    var newTMNodes = [
        {'lang': $scope.document.sourceLang, 'segment': $scope.segment.source },
        {'lang': $scope.document.targetLang, 'segment': $scope.segment.target },
      ];

    var transProm = $http({
      url: graphTMUrl,
      method: "POST",
      data: {
        'nodes': newTMNodes
      }
    });
    transProm.then(
      function (res) {
        $log.log('translation memory updated, the new nodes: ');
        $log.log(res);
      }, function (err) {
        $log.log('Error updating the translation memory');
      })

  }; // end segmentFinished

  // Re-opens a finished segment. Undoes what segmentFinished() did
  // TODO: this function assumes that there is already an editor on the scope, but Session.setSegment fires another event
  // TODO: this should be handled within the element itself -- there should be a single interface to segmentState
  $scope.reopen = function(idx) {
    $scope.segmentState.completed = false;
    Session.setSegment(idx);
    $scope.isActive.active = true;
  };

  // when the changeSegment event fires, each SegmentAreaCtrl scope responds
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
