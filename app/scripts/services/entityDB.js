angular.module('services')
.factory('entityDB', ['$http', '$log', function($http, $log) {

    // queries
    return {
      queryEntities: function(entityName) {
        return $http.get('http://localhost:5000/surface-forms/de/' + entityName);
      }
    }

}]);
