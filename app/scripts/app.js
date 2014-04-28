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
        'ngAnimate'
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

})
//.constant('baseUrl', 'http://protected-crag-2517.herokuapp.com/glossary');
.constant('baseUrl', 'http://localhost:5000')

// Allow CORS
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);
// TODO
// check window.location to see where we are, and set the baseUrl accordingly
//.run(['$location', '$log', function($location, $log) {
//  App.provider('baseUrl', function() {
//    return {
//      $get: function() {
//        $log.log('inside config, $location.absUrl: ' + $location.absUrl());
//        $log.log('inside config, $location.host: ' + $location.host());
//        return 'http://protected-crag-2517.herokuapp.com/glossary';
//      }
//    }
//  });
//}]);

