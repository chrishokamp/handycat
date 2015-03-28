// This service is a RESTful interface to a TranslationMemory Resource
// The translation memory is a resource -- different TMs implement the same RESTful API on the server

// call TAUS api and return data
//If the parameter value is prefixed with @ then the value for that parameter will be extracted from the corresponding property on the data object (provided when calling an action method). For example, if the defaultParam object is {someParam: '@someProp'} then the value of someParam will be data.someProp.
angular.module('services')
.factory('TranslationMemory', ['$resource', function($resource) {
    // TODO: add routes to different named TMs, or put the name of the desired TM as an argument?
    // TODO: how to provide a consistent API to all translation resources
    // TODO: how to cache requests to this $resource?
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

// this is how we were previously querying the TM from the toolbar
//     returns: {"provider":{"name":"Lingua Custodia","id":10635},"owner":{"name":"ECB","id":10975},"source":"Based on the reference amount of 4 million euro for the period 2002-2005 and 1 million euro for 2006, the annual appropriations authorised under the Pericles programme, were Euros 1.2 million for 2002; Euros 0.9 million for 2003;","industry":{"name":"Financials","id":12},"source_lang":{"name":"English (United States)","id":"en-us"},"target":"Sur la base du montant de référence de 4 millions d ' euros pour la période 2002-2005 et d ' un million d ' euros pour 2006, les crédits annuels autorisés dans le cadre du programme Pericles étaient de 1,2 millions d ' euros pour 2002, 0,9 million d ' euros pour 2003, 0,9 million d ' euros pour 2004, 1 million d ' euros pour 2005 et 1 million d ' euros pour 2006.","content_type":{"name":"Financial Documentation","id":10},"product":{"name":"Default","id":12512},"id":"en-us_fr-fr_11128729","target_lang":{"name":"French (France)","id":"fr-fr"}}
//$scope.queryTM = function(query) {
//  var queryObj = { 'userId': $rootScope.currentUser._id, 'sourceLang': $scope.sourceLang, 'targetLang': $scope.targetLang, query: query};
//  TranslationMemory.get(queryObj, function(tmResponse) {
//    // TODO: actually return a list of matches, don't create a list here
//    //$scope.tmMatches = tmResponse.segment;
//    $scope.tmMatches = [tmResponse];
//
//  });
//}


