angular.module('controllers').controller('TabsCtrl', ['$scope', function($scope) {
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

  }]

}]);
