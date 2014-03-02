'use strict';
var App = window.App = angular.module('editorComponentsApp',
      [
        'ui.router',
        'ngResource',
        'ngSanitize',
        'controllers',
        'directives',
        'services',
        'ui.ace',
        'ui.bootstrap',
        'angularFileUpload',
        'ngAnimate',
        //'filters',
        //'ui.bootstrap',
        //'ngTouch'
      ]
)
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('project', {
      url: '/project',
      templateUrl: 'views/project.html'
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

