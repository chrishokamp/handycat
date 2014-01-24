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
    ngSanitize: '../bower_components/angular-sanitize/angular-sanitize',
    uiAce: '../bower_components/angular-ui-ace/ui-ace',
    ace: '../bower_components/ace-builds/src/ace',
    //uiBootstrap: '../bower_components/angular-ui-bootstrap/dist/ui-bootstrap-tpls-0.10.0'
    // TODO: added to get access to the new popover template directive - found on github (somebody's modified uiBootstrap)
    uiBootstrap: 'vendor/ui-bootstrap-tpls-0.10.0',
    ngFileUpload: '../bower_components/ng-file-upload/angular-file-upload',
    // TODO: create a proper xliff parsing component
    xliffParser: 'lib/xliff_data_selector'
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
    uiBootstrap: {
      deps: ['angular'],
      exports: 'uiBootstrap'
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
    },
    uiAce: {
      deps: ['angular', 'ace'],
      exports: 'uiAce'
    },
    ngFileUpload: {
      deps: ['angular'],
      exports: 'ngFileUpload'
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
    'xliffParser',
    'controllers/controllers',
    'services/services',
    'directives/directives',
    'tokenRow/tokenRow',
    'tokenRow/draggable',
    'tokenRow/gap',
    'tokenRow/token',
    'aceEditor/AceCtrl',
    'glossary/Glossary',
    'services/glossary',
    'services/fileReader',
    'services/xliffParser',
    'services/document',
    'glossary/glossaryFileUpload',
    // TODO: ngFileSelect (local directive) has the same name as the library ngFileSelect
    //'directives/ngFileSelect',
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