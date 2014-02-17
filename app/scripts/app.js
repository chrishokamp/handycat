'use strict';
define(
  [
    'angular',
    'ngCookies',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'ngRoute',
    'uiRouter',
    'controllers/controllers',
    'directives/directives',
    'services/services',
    //'filters/filters',
    'uiAce',
    'uiBootstrap',
    'ngFileUpload',
  ],
  function(angular){
    var app = angular.module('editorComponentsApp',
      [
        'ngRoute',
        'ui.router',
        'ngResource',
        'ngAnimate',
        'controllers',
        'directives',
        'services',
        'ui.ace',
        'ui.bootstrap',
        'services',
        'angularFileUpload',
        //'filters',
        //'ui.bootstrap',
        //'ngTouch'
      ]
    );

    app.config(['$httpProvider', function($httpProvider) {
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);

    return app;
  }
);
