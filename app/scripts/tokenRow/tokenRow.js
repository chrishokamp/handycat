// this directive represents the component at row scope
angular.module('controllers').controller('RowCtrl', ['$scope', function ($scope) {
  //   TODO:  make directive encapsulating token functionality

  // global which tracks the dragged elements
  // a list of draggable tokens
  $scope.tokens = ["AND", "THERE'S A BARREL", "THAT", "I", "DIDN'T FILL"];
}]);
