// the EditModeCtrl is an interface between an EditMode and a UI component
angular.module('controllers')
.controller('EditModeCtrl', ['$scope', 'EditModeFactory', function($scope, EditModeFactory) {
  // initialize the EditMode with a tokenizer and a detokenizer

  // Working  - the EditModeCtrl provides the interface between the EditMode and the UI component
  // TODO: the code below was copied from AceCtrl
  // the following functions expose control of the current mode on the $scope
  $scope.selectNextRange = function() {
    currentMode.selectNextTokenRange();
  };

  $scope.selectPrevRange = function() {
    currentMode.selectPrevTokenRange();
  };

  // the following functions expose control of the current mode on the $scope
  $scope.moveCurrentEditRange = function() {
    currentMode.moveCurrentRange(1);
  };

  var currentMode = EditMode(tokenizer.getTokenRanges, selectRange);

}]);


