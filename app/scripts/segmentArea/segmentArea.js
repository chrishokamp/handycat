// the segment area is the area of the UI representing a single translation unit
// this is a source + target pair
angular.module('controllers')
.controller('SegmentAreaCtrl', [
  '$rootScope', '$scope', 'Wikipedia', 'Glossary', 'GermanStemmer', '$sce', '$log', 'ruleMap', 'copyPunctuation',
  'Morphology', 'Document', 'project', 'entityLinker', 'entityDB',
  function($rootScope, $scope, Wikipedia, Glossary, GermanStemmer, $sce, $log, ruleMap, copyPunctuation, Morphology,
           Document, Project, entityLinker, entityDB) {

  $scope.entities = {};
  $scope.entities.entityMap = {};
  $scope.entities.currentEntity = {};
  $scope.entities.entityData = {};

  $scope.test = { 'test': 'TEST'};

  $scope.insertSurfaceForm = function(sf) {
    $log.log('INSERT SURFACE FORM: ' + sf);
    $scope.insertText(' ' + sf + ' ');
  }

  $scope.getLink = function() {
    $log.log($scope.entities.entityMap);
    return 'http://dbpedia.org/resource/' + $scope.entities.currentEntity.name;
//    if ($scope.entities.entityMap[surfaceForm]) {
//      return $scope.entities.entityMap[surfaceForm];
//    }
//    return '';

  }

  // (1) - surface forms
  // (2) - entity name (in German)
  // (1) - return entity name
  $scope.$on('find-surface-forms', function(e, data) {
    $log.log('find-surface-forms heard in segmentArea');
    $scope.findSurfaceForms(data.sf);
  });

  $scope.findSurfaceForms = function(entityName) {

//    var entityName = 'Berlin';
    $log.log('entityName: ' + entityName);
    var sfPromise = entityDB.queryEntities(entityName);
    sfPromise.then(
      function(res) {
        $log.log('queried entities for surface form of: ' + entityName);
        $log.log(res.data);
        var surfaceForms = res.data;

        $scope.entities.currentEntity.surfaceForms = [];
        $scope.entities.currentEntity.name = entityName;
        angular.forEach(surfaceForms, function(sf) {
          var sfObj = { 'name': sf[0], 'count': parseFloat(sf[1]) };
          $log.log(sfObj);
          $scope.entities.currentEntity.surfaceForms.push(sfObj);
        });
        $log.log("surfaceForms:");
        $log.log($scope.entities.currentEntity.surfaceForms);
      }
    );
  }

  $scope.linkSourceEntities = function() {

    $log.log('linkSourceEntities');
    var annotationPromise = entityLinker.annotate($scope.segment.source);

    // see http://stackoverflow.com/questions/18690804/insert-and-parse-html-into-view-using-angularjs
    annotationPromise.then(
      function (res) {
        $log.log('entity linking res: ');
        $log.log(res.data);
        var result = res.data;
        if (result.Resources) {
          $scope.entities.entityData = result.Resources;
          $scope.entities.entityMap[result['@surfaceForm']] = result['@URI'];

          // tell the source area that we've got entities
          // source area should tag, compile, and replace
          $scope.$broadcast('update-source', { 'entityData': result.Resources });
        }
      },
      function(e) {
        $log.log('Error in entity linking request');
      }
    );


    // result looks like this:

//Object {@text: "Blaise Pascal designed and constructed the first w…hanical calculator, Pascal's calculator, in 1642.", @confidence: "0.5", @support: "0", @types: "", @sparql: ""…}
//@confidence: "0.5"
//@policy: "whitelist"
//@sparql: ""
//@support: "0"
//@text: "Blaise Pascal designed and constructed the first working mechanical calculator, Pascal's calculator, in 1642."
//@types: ""
//Resources: Array[2]
//0: Object
//@URI: "http://dbpedia.org/resource/Blaise_Pascal"
//@offset: "0"
//@percentageOfSecondRank: "4.0041326330454826E-20"
//@similarityScore: "1.0"
//@support: "515"
//@surfaceForm: "Blaise Pascal"
//@types: "DBpedia:Agent,Schema:Person,Http://xmlns.com/foaf/0.1/Person,DBpedia:Person,DBpedia:Philosopher"
//__proto__: Object
//1: Object
//@URI: "http://dbpedia.org/resource/Mechanical_calculator"
//@offset: "57"
//@percentageOfSecondRank: "0.2968657118710354"
//@similarityScore: "0.7710898598415911"
//@support: "126"
//@surfaceForm: "mechanical calculator"
//@types: "
  };

  // Note: don't do $scope.$watches, because we reuse this controller many times!
  // TODO: set this only when this is the active scope
  $scope.isActive = { active:true };
  $scope.segmentState = { currentState: 'untranslated', complete: false };

  /*
  $scope.activate = function(index) {
  $log.log("Index: " + $scope.index);
    $rootScope.$broadcast('activate-segment', index);
  };

  $scope.$on('activate-segment', function(event, index) {
      $log.log("Index: " + $scope.index + " " + "index: " + index);
    $scope.isActive.active = $scope.index == index;
  });*/

  $scope.language = Document.targetLang;

  // for the concordancer - default to English
  $scope.queryLang = 'en';

// currently the model names on the child controllers are different
  $scope.setSource = function(sourceSentence) {
    $log.log("setSource");
    $log.log("source is: " + sourceSentence);
    $scope.segment.source = sourceSentence;
  };
  $scope.setTarget = function(targetSentence) {
     $scope.segment.target = targetSentence;
  };

  // Text currently selected in the child editor
  $scope.setTextSelection = function(text, range) {
    $scope.selectedToken = text;
    $scope.selectedRange = range;
    $log.log('setTextSelection fired, selectedToken: '+$scope.selectedToken+' selectedRange: ' + $scope.selectedRange);
  };

  $scope.copySourcePunctuation = function() {
    $log.log('copy source called');
    var source = $scope.segment.source;
    var target = $scope.segment.target;
    $scope.segment.target = copyPunctuation.copySourcePunctuation(source, target);

    Project.updateStat('copyPunctuation', $scope.$index);
    // Only adds the action to the edit history if it actually did something.
    if ($scope.segment.target !== target) {
      $scope.editHistory.push(
        ruleMap.newRule('copy-source-punctuation', '', '', 'Copy punctuation from source segment'));
    }
  };

  // sets the current target token
  $scope.setCurrentToken = function(token) {
     $scope.currentToken = token;
  };

  $scope.changeTokenNumber = function(param) {
    $log.log('Change token number param: ' + param);
    // toggle the working state of the button
    $scope.changeNumberWorking = true;

    // the current selection is a range object from the Ace Editor
    if ($scope.selectedToken && $scope.selectedRange) {
      $log.log('change token number');
      var phrase = $scope.selectedToken;
      $log.log('the phrase to change is: ' + phrase);

//      var res = Morphology.changeNumber(phrase, 'de');
      var res = Morphology.changeNumber(phrase, 'de', param);
      res.then(
        function(result) {
          $log.log('the result from the morphology server: ');
          $log.log(result);

          // this function is on the AceCtrl
          $scope.insertText(result.data['converted_phrase']);
          $scope.changeNumberWorking = false;
        },
        function(err) {
          $log.log('changeNumber failed');
          $scope.changeNumberWorking = false;
        }
      );

      Project.updateStat('changeNumber', $scope.$index, phrase);
    }
  };
  $scope.changeTokenGender = function(param) {
    // toggle the working state of the button
    $scope.changeGenderWorking = true;

    // the current selection is a range object from the Ace Editor
    if ($scope.selectedToken && $scope.selectedRange) {
      $log.log('change token gender');
      var phrase = $scope.selectedToken;
      $log.log('the phrase to change is: ' + phrase);

      var res = Morphology.changeGender(phrase, 'de', param);
      res.then(
        function(result) {
          $log.log('the result from the morphology server: ');
          $log.log(result);

          // this function is on the AceCtrl
          $scope.insertText(result.data['converted_phrase']);
          $scope.changeGenderWorking = false;
        },
        function(err) {
          $log.log('changeGender failed');
          $scope.changeGenderWorking = false;
        }
      );
      Project.updateStat('changeGender', $scope.$index, phrase);
    }
  };
  $scope.changeTokenCase = function(param) {
    // toggle the working state of the button
    $scope.changeCaseWorking = true;

    // the current selection is a range object from the Ace Editor
    if ($scope.selectedToken && $scope.selectedRange) {
      $log.log('change token case');
      var phrase = $scope.selectedToken;
      $log.log('the phrase to change is: ' + phrase);

      var res = Morphology.changeCase(phrase, 'de', param);
      res.then(
        function(result) {
          $log.log('the result from the morphology server: ');
          $log.log(result);

          // this function is on the AceCtrl
          $scope.insertText(result.data['converted_phrase']);
          $scope.changeCaseWorking = false;
        },
        function(err) {
          $log.log('changeCase failed: ' + err);
          $scope.changeCaseWorking = false;
        }
      );
      Project.updateStat('changeCase', $scope.$index, phrase);
    }
  };

  $scope.queryConcordancer = function(query, lang) {
    $log.log('query is: ' + query + ', lang is: ' + lang);
    $scope.concordancerError = false;
    Project.updateStat('queryConcordancer', $scope.$index, query);
    Wikipedia.getConcordances(query, lang);
  };

  $scope.$on('concordancer-updated', function() {
// does $scope.$apply happen automagically? - answer: no, so we have to listen for the event
    $scope.concordanceMatches = Wikipedia.currentQuery;
  });

  $scope.$on('concordancer-error', function() {
    $scope.concordancerError = true;
  });

  // special chars toolbar showing
  $scope.showSpecialChars = true;

  // testing the special chars directive
  $scope.germanChars = ['ä','ö','ü','Ä','Ö','Ü','ß'];
  $scope.insertChar = function(char) {
    $log.log("char to insert: " + char);
    $scope.insertText(char);
  };

  // convert a snippet to trusted html - TODO: this isn't reusable becuase we send back x.snippet
  $scope.getSnippet = function(concordanceMatch) {
    return $sce.trustAsHtml(concordanceMatch.snippet);
  };

  // used as a callback for the glossary
  var updateGlossaryArea = function(glossaryMatches) {
    $log.log('Inside callback, the glossary matches: ');
    $log.log(glossaryMatches);
    if (glossaryMatches)
      $scope.glossaryMatches = glossaryMatches.map(function(item) {
        return item.text;
      });
  };

// TODO: collapse (remove from DOM) when this segment goes out of focus
  $scope.isCollapsed = {collapsed: true};
  $scope.toggleToolbar = function(bool) {
    if (arguments.length > 0) {
      $scope.isCollapsed = { collapsed: bool };
// TODO: there is a broken corner-case here
    } else {
      $scope.isCollapsed = { collapsed: !$scope.isCollapsed.collapsed };
    }
    $log.log("isCollapsed: the value of isCollapsed is: " + $scope.isCollapsed.collapsed);
  };

  $scope.clearEditor = function() {
   $log.log('clear editor fired on the segment control');
   $scope.$broadcast('clear-editor');
  };

  $scope.getOtherWordForms = function(stemmedToken) {
    $log.log('other word forms called with: ' + stemmedToken);
    $scope.otherWordForms = GermanStemmer.getOtherForms(stemmedToken);
  };

// TODO: use a promise
  // prep the model
  var glossary = {};
  glossary.glossaryQuery = undefined;
  $scope.glossary = glossary;
  $scope.queryGlossary = function(query, fromLang, toLang) {
    Glossary.getMatches(query, updateGlossaryArea, fromLang, toLang);
    Project.updateStat('queryGlossary', $scope.$index, query);
  };

  // Informs other segments that they should make a change.
  // The event argument is a unique object created by the ruleMap service.
  // The event will probably be received by the broadcaster as well so the action handlers
  // should check first if the edit should be applied or not.
  $scope.propagateEdit = function(index) {
      $rootScope.$broadcast('propagate-action', $scope.editHistory[index]);
      Project.updateStat('propagateAction', $scope.$index, $scope.editHistory[index].operation);
  };

  // Trigger propagated edits
  $scope.$on('propagate-action', function(event, edit) {
    $log.log(edit);
    if (edit.operation == 'copy-source-punctuation') {
      $scope.copySourcePunctuation();
    }
    // Add more action handlers here if needed.
  });

  $scope.addToEditHistory = function(edit) {
    $scope.editHistory.push(edit);
  };

  // List of edit actions performed on this segment
  $scope.editHistory = [];

  $scope.segmentFinished = function(segId) {
    $log.log("segId is: " + segId);

    $scope.segmentState.completed = true;
    Project.updateStat('segmentFinished', segId);

    Document.completedSegments[segId] = true;
    Project.setActiveSegment(segId);
    Project.focusNextSegment();

    // Update the current segment
    $scope.segment.targetDOM.textContent = $scope.segment.target;
    Document.revision++;
  };

}]);

