'use strict';

// Global debug
var DEBUG = true;
var d = function(){
	if (DEBUG && console) { console.log(arguments); }
};

require.config({
	paths: {
		angular: 	'../bower_components/angular/angular',
		ngRoute: 	'../bower_components/angular-route/angular-route',
		ngResource: '../bower_components/angular-resource/angular-resource',
		jquery: 	'../bower_components/jquery/jquery.min',
    jqueryui: 	'../bower_components/jqueryui/ui/jquery-ui',
		underscore: '../bower_components/underscore/underscore-min',
    domReady: '../bower_components/domready/ready',
    ngCookies: '../bower_components/angular-cookies/angular-cookies',
    ngSanitize: '../bower_components/angular-sanitize/angular-sanitize'
	},
	shim: {
		angular: {
			deps: ['jquery', 'jqueryui'],
			exports: 'angular'
		},
    jqueryui: {
      deps: ['jquery'],
      exports: 'jqueryui'
    },
		ngRoute: {
			deps: ['angular'],
			exports: 'ngRoute'
		},
		ngResource: {
			deps: ['angular'],
			exports: 'ngResource'
		},
    ngCookies: {
      deps: ['angular'],
      exports: 'ngCookies'
    },
    ngSanitize: {
      deps: ['angular'],
      exports: 'ngSanitize'
    }
	}
});

require(
	[
		'angular',
		'app',
    'domReady',
		'ngRoute',
		'ngResource',
    'ngCookies',
    'ngSanitize',
		'underscore',
    'controllers/controllers',
    'tokenRow/tokenRow',
    'tokenRow/draggable',
    'tokenRow/gap',
    'tokenRow/token',
    'controllers/main',
    'directives/directives'
	],
	function(angular, app, domReady){
		app.config(['$routeProvider',
			function($routeProvider){
				$routeProvider
          .when('/', {
            templateUrl: 'views/main.html'
            //controller: 'MainCtrl'
           })
					.otherwise({
						redirectTo: '/'
					});
			}
		]);
		domReady(function(){
			angular.bootstrap(document, ['editorComponentsApp']);
		});
	}
);