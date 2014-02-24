'use strict';
var App = window.App = angular.module('editorComponentsApp',
      [
        'ui.router',
        'ngResource',
        'ngAnimate',
        'controllers',
        'directives',
        'services',
        'ui.ace',
        'ui.bootstrap',
        'angularFileUpload',
        //'filters',
        //'ui.bootstrap',
        //'ngTouch'
      ]
)
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'views/project.html',
      controller: ''
    })
    .state('ace', {
      url: '/ace',
      templateUrl: 'scripts/aceEditor/ace-drag-test.html'
    })
    .state('edit', {
      url: '/edit',
      templateUrl: 'views/edit.html'
    });

  $urlRouterProvider
    .otherwise('/project');

});
//domReady(function() {angular.bootstrap(document, ['editorComponentsApp']);})

//    app.config(['$httpProvider', function($httpProvider) {
//      $httpProvider.defaults.useXDomain = true;
//      delete $httpProvider.defaults.headers.common['X-Requested-With'];
//    }]);

