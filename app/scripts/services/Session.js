'use strict';

angular.module('services')
  .factory('Session', function ($resource) {
    return $resource('/auth/session/');
  });
