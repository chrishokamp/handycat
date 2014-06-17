// this service works with the logger directive to keep track of all user actions
angular.module('services')
.factory('actionLogger', ['$rootScope', 'baseUrl', '$http', '$log', function($rootScope, baseUrl, $http, $log) {

  var loggerEndpoint = baseUrl;

  return {
    logAction: function(action) {

    }
  }





}]);
