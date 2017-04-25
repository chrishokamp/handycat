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
        // 'ui.ace',
        'ui.bootstrap',
        'angularFileUpload',
        'ngAnimate',
        'ui.bootstrap.tooltip',
        'http-auth-interceptor',
        'snap',
        'ngMaterial',
        'cfp.hotkeys',
        'angular-select-text',
        'handycatConfig',
        'handycat.typeaheads',
        'handycat.editors',
        'handycat.posteditors',
        'handycat.wordLevelQe',
        'handycat.trieAutocomplete'

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
      controller: 'ProjectCtrl'
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
    // WORKING ON LM TYPEAHEAD
    .state('/typeahead', {
      url: '/typeahead',
      templateUrl: '/views/typeahead.html',
      //controller: 'SignupCtrl'
    })

  $urlRouterProvider
    .otherwise('/login');

    // Note: enabling html5Mode requires you to make absolute paths in index.html
    // see: http://stackoverflow.com/questions/24763489/html5-mode-ui-router-uncaught-syntaxerror-unexpected-token
//  $locationProvider.html5Mode(true);
})

// Allow CORS
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }])

// control the $log service for dev convenience
.config(['$provide', function($provide) {
// decorates the $log instance to disable logging
  $provide.decorator('$log', ['$delegate',
    function($delegate) {
      var $log, enabled = true;
      var disabledMethods = [];

      $log = {
        debugEnabled: function(flag) {
          enabled = !!flag;
        },
        disable: function(methodNames) {
          disabledMethods = methodNames;
        }

      };

      // methods implemented by Angular's $log service
      ['log', 'warn', 'info', 'error'].forEach(function(methodName) {
        $log[methodName] = function() {
          if (!enabled || disabledMethods.indexOf(methodName) >= 0) return;

          var logger = $delegate;
          logger[methodName].apply(logger, arguments);
        }
      });
      return $log;
    }
  ]);
}])

// check window.location to see where we are
  .run(['$location', '$rootScope', 'Auth', '$state', '$stateParams', '$log',
    function($location, $rootScope, Auth, $state, $stateParams, $log) {
      //watching the value of the currentUser variable.
      $rootScope.$watch('currentUser', function(currentUser) {
        // if no currentUser and on a page that requires authorization then try to update it
        // will trigger 401s if user does not have a valid session
        if (!currentUser && (['/', '/login', '/logout', '/signup'].indexOf($location.path()) == -1 )) {
          $log.error('No current user')
          Auth.currentUser();
        }
      });

      // On catching 401 errors, redirect to the login page.
      $rootScope.$on('event:auth-loginRequired', function() {
        $log.error('App heard 401 -- redirecting to /login');
        $location.path('/login');
        return false;
      });

      // expose state information on the rootScope
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      // configure the logger (see the $decorator above)
      $log.debugEnabled(true);
      $log.disable(['warn']);
  }])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('orange');
  });

