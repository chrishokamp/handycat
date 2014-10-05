// This service is a RESTful interface to a TranslationMemory Resource
// The translation memory is a resource -- different TMs implement the same RESTful API on the server

// call TAUS api and return data
angular.module('services')
.factory('TranslationMemory', ['$resource', '$log', function($resource, $log) {
    // TODO: add routes to different named TMs, or put the name of the desired TM as an argument?
    return $resource('/users/tm/', {},
      {
        'update': {
          method:'PUT'
        }
      });

}]);
