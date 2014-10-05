'use strict';

//If the parameter value is prefixed with @ then the value for that parameter will be extracted from the corresponding property on the data object (provided when calling an action method). For example, if the defaultParam object is {someParam: '@someProp'} then the value of someParam will be data.someProp.


angular.module('services')
  .factory('User', function ($resource) {
    return $resource('/auth/users/:userId/', { userId: '@userId'},
      {
        'update': {
          method:'PUT'
        }
      });
  });
