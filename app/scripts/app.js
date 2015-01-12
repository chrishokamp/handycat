'use strict';
var App = window.App = angular.module('editorComponentsApp',
      [
        'ui.router',
        'ngResource',
        'ngCookies',
        'ngSanitize',
        'controllers',
        'directives',
        'services',
        'ui.ace',
        'ui.bootstrap',
        'angularFileUpload',
        'ngAnimate',
        'ui.bootstrap.tooltip',
        'http-auth-interceptor',
        'snap',
        'ngMaterial',
        //'summaryMenu'
        //'filters',
        //'ngTouch'
      ]
)
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('projects', {
      abstract: true,
      url: '/projects',
      templateUrl: '/views/projects.html'
    })
    .state('projects.list', {
      url: '/list',
      templateUrl: '/views/partials/projects/project-list.html'
    })
    // TODO: factor out the common logic between projects.create and projects.edit
    .state('projects.edit', {
      url: '/edit',
					onEnter: ['$stateParams', '$state', '$modal', '$log', function($stateParams, $state, $modal, $log) {
            // todo: close on state change
						$modal.open({
              templateUrl: '/views/partials/projects/create.html',
							controller: 'CreateProjectCtrl',
							backdrop: true,
							keyboard: true
						})
						.result.then(function(result) {
							$state.go('projects.list', { reload: false });
						});
					}]
				})
    // edit the project information
    .state('projects.create', {
      url: '/create',
        onEnter: ['$stateParams', '$state', '$log', '$mdDialog', function($stateParams, $state, $log, $mdDialog) {
          function afterShowAnimation() {
            $log.log('afterShowAnimation fired');
          }
        $mdDialog.show({
          templateUrl: '/views/partials/projects/create.html',
          controller: 'CreateProjectCtrl',
          onComplete: afterShowAnimation
        })
        .then(function(result) {
            $log.log('Inside $mdDialog promise resolution');
            $state.go('projects.list', { reload: false });
        }, function(err) {
            $log.log('Error: $mdDialog promise resolution error callback');
            $state.go('projects.list', { reload: false });
        });
      }]
    })
    .state('projects.translate', {
      url: '/:projectId/translate',
      templateUrl: '/views/translate.html',
      controller: 'ProjectCtrl',
    })
    .state('settings', {
      url: '/settings',
      templateUrl: '/views/settings.html',
      controller: 'UserSettingsCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: '/views/login.html',
      controller: 'LoginCtrl'
    })
    .state('/signup', {
      url: '/signup',
      templateUrl: '/views/signup.html',
      controller: 'SignupCtrl'
    })

  $urlRouterProvider
    .otherwise('/login');

    // Note: enabling html5Mode requires you to make absolute paths in index.html
    // see: http://stackoverflow.com/questions/24763489/html5-mode-ui-router-uncaught-syntaxerror-unexpected-token
//  $locationProvider.html5Mode(true);
})

// heroku
//.constant('baseUrl', 'http://protected-crag-2517.herokuapp.com/glossary');


// panacea
//.constant('baseUrl', 'http://panaceadcu.dh.bytemark.co.uk:5002')


// check window.location to see where we are, and set the baseUrl accordingly
.run(['$location', '$rootScope', 'Auth', '$log', function($location, $rootScope, Auth, $log) {
  //watching the value of the currentUser variable.
    $rootScope.$watch('currentUser', function(currentUser) {
      // if no currentUser and on a page that requires authorization then try to update it
      // will trigger 401s if user does not have a valid session
      if (!currentUser && (['/', '/login', '/logout', '/signup'].indexOf($location.path()) == -1 )) {
        Auth.currentUser();
      }
  });

  // On catching 401 errors, redirect to the login page.
  $rootScope.$on('event:auth-loginRequired', function() {
    $location.path('/login');
    return false;
  });
}])

// Allow CORS
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])

  // see: https://github.com/angular-ui/bootstrap/blob/master/src/tooltip/tooltip.js
//.config(['$tooltipProvider', function( $tooltipProvider ) {
    .config(['$tooltipProvider', function( $tooltipProvider ) {
   // place tooltips left instead of top by default
//   $tooltipProvider.options( { placement: 'left' } );
   // $tooltipProvider.options( { trigger: 'click' } );

//  App.provider('baseUrl', function() {
//    return {
//      $get: function() {
//        $log.log('inside config, $location.absUrl: ' + $location.absUrl());
//        $log.log('inside config, $location.host: ' + $location.host());
//        return 'http://protected-crag-2517.herokuapp.com/glossary';
//      }
//    }
//  });
}]);

