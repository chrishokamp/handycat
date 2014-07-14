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
        'ui.bootstrap.tooltip'
        //'filters',
        //'ngTouch'
      ]
)
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('project', {
      url: '/project',
      templateUrl: 'views/project.html'
    })
    .state('edit', {
      url: '/edit',
      templateUrl: 'views/edit.html'
    })
    .state('edit.segment', {
      url: '/segment/:segmentId'
    });

  $urlRouterProvider
    .otherwise('/project');
})

// heroku
//.constant('baseUrl', 'http://protected-crag-2517.herokuapp.com/glossary');
// localhost
.constant('baseUrl', 'http://0.0.0.0:5002')
// panacea
//.constant('baseUrl', 'http://panaceadcu.dh.bytemark.co.uk:5002')
.constant('loggerUrl', 'http://panaceadcu.dh.bytemark.co.uk:5001')

// Allow CORS
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])
  // see: https://github.com/angular-ui/bootstrap/blob/master/src/tooltip/tooltip.js
.config(['$tooltipProvider', function( $tooltipProvider ) {
   // place tooltips left instead of top by default
//   $tooltipProvider.options( { placement: 'left' } );
   // $tooltipProvider.options( { trigger: 'click' } );
//    $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
//    $tooltipProvider.setTriggers( {'mouseenter': 'click'} );
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

