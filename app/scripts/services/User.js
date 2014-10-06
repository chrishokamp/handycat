'use strict';



angular.module('services')
  .factory('User', function ($resource) {
    return $resource('/auth/users/:userId/', { userId: '@userId'},
      {
        'update': {
          method:'PUT'
        }
      });
  });
