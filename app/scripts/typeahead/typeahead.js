angular.module('controllers').controller('TypeaheadCtrl', ['$scope', '$interval', '$log',  function($scope, $interval, $log) {
  $scope.selected = 'Ala';
  $scope.$watch(function() { return $scope.selected}, function(val) { $log.log('$scope.selected is: ' + val);})
  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
//  $scope.$viewValue = 'ala';
  $interval(
    function() {
      $log.log($scope.selected);
    }, 750
  )

//   $scope.getLocation = function(val) {
//    return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
//      params: {
//        address: val,
//        sensor: false
//      }
//    }).then(function(response){
//      return response.data.results.map(function(item){
//        return item.formatted_address;
//      });
//    });
//  };
}]);
