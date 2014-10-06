// This service is a RESTful interface to a TranslationMemory Resource
// The translation memory is a resource -- different TMs implement the same RESTful API on the server

// call TAUS api and return data
//If the parameter value is prefixed with @ then the value for that parameter will be extracted from the corresponding property on the data object (provided when calling an action method). For example, if the defaultParam object is {someParam: '@someProp'} then the value of someParam will be data.someProp.
angular.module('services')
.factory('TranslationMemory', ['$resource', '$log', function($resource, $log) {
    // TODO: add routes to different named TMs, or put the name of the desired TM as an argument?
    return $resource('/users/:userId/tm/',
      {
        userId: '@userId',
        sourceLang: '@sourceLang',
        targetLang: '@targetLang',
        query: '@query'
      },
      {
        'update': {
          method:'PUT'
        }
      });

}]);
